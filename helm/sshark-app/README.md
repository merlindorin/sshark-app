# sshark-app Helm Chart

## Prerequisites

### Clerk Authentication Secret

Create a Kubernetes secret with your Clerk credentials before deploying:

```bash
kubectl create secret generic sshark-clerk-secret \
  --namespace sshark \
  --from-literal=CLERK_SECRET_KEY='sk_live_xxxxx'
```

Then configure your values to use it:

```yaml
envFrom:
  - secretRef:
      name: sshark-clerk-secret
```

## Installation

```bash
helm upgrade --install sshark-app ./helm/sshark-app \
  --namespace sshark \
  --create-namespace \
  --set envFrom[0].secretRef.name=sshark-clerk-secret
```

## Configuration

| Parameter | Description | Default |
|-----------|-------------|---------|
| `envFrom` | Environment variables from secrets/configmaps | `[]` |
| `image.repository` | Image repository | `ghcr.io/merlindorin/sshark-app` |
| `image.tag` | Image tag | `appVersion` |
| `ingress.enabled` | Enable ingress | `false` |

See [values.yaml](./values.yaml) for all configuration options.
