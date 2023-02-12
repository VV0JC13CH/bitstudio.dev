+++
title = "Proxmox: gather dynamic IP addresses in terraform"
date = 2023-02-12
description = "In this post I will show how to gather IP addresses of Proxmox VMs based on MAC addresses of their network devices."
[taxonomies]
categories=["snippets"]
tags=["proxmox", "terraform", "python", "bash", "talos"]
+++

## Issue

-   IP addresses are unknown after creation of VMs with [Talos Linux](https://www.talos.dev/v1.3/talos-guides/). It's not possible to assign QEMU agent to control them. They are assigned by local DHCP server (router) and are hard to predict. The only way to read them is by using built-in Proxmox shell and copy them from display. Imahes do not allow control over shell, only access is through API. It's possible to change IP addresses by API, but to reach API IP address has to be known.

-   Integration of various providers in terraform requires additional manual work, f.e. [Telmate/proxmox](https://registry.terraform.io/providers/Telmate/proxmox/latest/docs) with [Siderolabs/talos](https://registry.terraform.io/providers/siderolabs/talos/latest). Each VM has to be created, IP has to be readed from display, IP has to be changed by API.
<div align="center"> <img src="proxmox_shell.png" /> </div>

## Solution

In order to automate full process of provisioning, from creation of VM in Proxmox to configuration, special type of terraform data, called 'External' has to be implemented.
All IP addresses are going to be shown in output of Proxmox terraform workspace as below:

```terraform
  + qemu_ip_addresses = {
      + "200" = "192.168.1.97"
      + "201" = "192.168.1.98"
      + "202" = "192.168.1.99"
      + "203" = "192.168.1.108"
      + "204" = "192.168.1.107"
      + "205" = "192.168.1.109"
      + "206" = "192.168.1.112"
      + "207" = "192.168.1.114"
      + "208" = "192.168.1.113"
    }
```

Script search for MAC addresses inside `*.conf` files in `/etc/pve/qemu-server` catalog and returns JSON in form `{'VM_ID': 'IP_ADDRESS'}`.
In order to find IP address nmap python wrapper is used.

## Limits

In this example there is assumption that each VM has single network device. Script is very easy to extend, so you can experiment with whatever you want.

## Pre-requirements

-   Install pip inside Proxmox host `sudo apt install pip`
-   Install python-libnmap `pip install python-libnmap`
-   Ensure you have ssh key that gives access to Proxmox host without passphrase
-   Basic Terraform workspace for Proxmox

## Implementation

### Add private ssh key to secrets

Encode private ssh key of your used with base64. It's required because env vars do not accept newlines. Please keep in mind that this is not top tier secure solution, do it for your lab, but not production.

```bash
 ~/.ssh/id_rsa_pve -w 0
```

Go to your terraform workspace and add env variable `ID_RSA`, select 'sensible'.

### Create directory with scripts

```bash
cd ~/terraform/proxmox
mkdir scripts
touch mac-to-ip.py mac-to-ip.sh
chmod +x mac-to-ip.sh
```

Copy scripts to your files:

#### mac-to-ip.py

```python
#!/usr/local/bin/python
# -*- coding: utf-8 -*-

from libnmap.process import NmapProcess
from libnmap.parser import NmapParser
from time import sleep
import socket, os, re, json

# assign directory
directory = "/etc/pve/qemu-server"
match_mac_with_ids = {}
match_ip_with_ids = {}

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    # checking if it is a file
    if os.path.isfile(f):
        with open(f) as config_file:
            for line in config_file:
                if "net0:" in line or "vmbr" in line or "bridge=" in line:
                    # Extract mac address from a string
                    extract_mac_address_pattern = (
                        "(?:[0-9A-Fa-f]{2}[:-]){5}(?:[0-9A-Fa-f]{2})"
                    )
                    mac_address = re.findall(extract_mac_address_pattern, line)
                    id_vm = filename.rstrip(".conf")
                    mac_vm = mac_address[0]
                    match_mac_with_ids.update({id_vm: mac_vm})

for _id_vm, _mac_vm in match_mac_with_ids.items():
    ip = socket.gethostbyname(socket.gethostname())  # local ip
    # print(f'Here is your local ip {ip}')
    nm = NmapProcess(f"{ip}/24", options="-sP")
    nm.run_background()

    while nm.is_running():
        # print(f'Nmap Scan running: ETC: {nm.etc} DONE: {nm.progress}%')
        sleep(2)
    nmap_report = NmapParser.parse(nm.stdout)

    res = next(
        filter(
            lambda n: n.mac == _mac_vm.strip().upper(),
            filter(lambda host: host.is_up(), nmap_report.hosts),
        ),
        None,
    )
    if res is None:
        pass
    else:
        match_ip_with_ids.update({_id_vm: res.address})
json_object = json.dumps(match_ip_with_ids, indent=4)
print(json_object)
```

#### mac-to-ip.sh

Change `USER@PROXMOX_IP` with your values. `USER` has to be the owner of ssh private key and `PROXMOX_IP` should target your proxmox host.

```bash
#!/bin/bash

# Exit if any of the intermediate steps fail
set -e

echo "$ID_RSA" | base64 --decode > ./id_rsa
chmod 400 ./id_rsa
sleep 2;
ssh -i ./id_rsa -q -o StrictHostKeyChecking=no USER@PROXMOX_IP "python3 " < './mac-to-ip.py' | jq
```

### Create data and output in .tf

#### output.tf

```terraform
### IP ADDRESSES OF VMs ###

data "external" "get-ip-of-vms-based-on-mac" {
  program     = ["sh", "mac-to-ip.sh"]
  working_dir = "scripts/"
}

output "qemu_ip_addresses" {
  value = data.external.get-ip-of-vms-based-on-mac.result
}
```

### Space for improvements

-   Installation of pip can be automated.
-   SSH private key can be created and send by API in terraform, so it will be in `authorized_keys` before execution.
-   Support for more than one network device

## Sources

-   [1] [terraform/docs/external](https://registry.terraform.io/providers/hashicorp/external/latest/docs) \
