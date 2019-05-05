#!/usr/bin/env bash
rsync -avz --chmod u=rwX,go=rX build/ garbu.re:sites/minipainting/ig
