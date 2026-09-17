#!/bin/bash
echo "Starting auto-restarting tunnel..."
while true; do
    npx -y localtunnel --port 8000 --subdomain career-api-hackathon-2026
    echo "Tunnel crashed, restarting in 2 seconds..."
    sleep 2
done
