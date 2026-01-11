# sshark-app Helm Chart

## Prerequisites

### Clerk Authentication Secret

Create a Kubernetes secret with your Clerk credentials:

```bash
kubectl create secret generic sshark-clerk \
  --namespace sshark \
  --from-literal=CLERK_SECRET_KEY='sk_live_xxxxx'
```

## Installation

```bash
helm upgrade --install sshark-app ./helm/sshark-app \
  --namespace sshark \
  --create-namespace \
  --set clerk.secretName=sshark-clerk
```

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `clerk.secretName` | Name of the secret containing Clerk credentials | `""` |
| `clerk.secretKey` | Key in the secret for CLERK_SECRET_KEY | `"CLERK_SECRET_KEY"` |
| `image.repository` | Image repository | `ghcr.io/merlindorin/sshark-app` |
| `image.tag` | Image tag | `appVersion` |
| `ingress.enabled` | Enable ingress | `false` |

See [values.yaml](./values.yaml) for all configuration options.
