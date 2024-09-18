#!/bin/bash

set -e

# Load environment variables from .env.local
export $(grep -v '^#' .env.local | xargs)

docker compose up --build