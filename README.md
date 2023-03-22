# Creating a Cluster using custom image in K8s

### Objectives :

1. Initialise a directory with npm
2. Create a basic server using Node.js
3. Create a dockerfile to create an image and push it on docker hub
4. Create a YAML file to fire up a cluster with custom build image nodes.
5. Expose the External IP using type as Load Balancer.

- Start by initialising Node app

```bash
npm init

npm I express
```

- Create a file "index.js"

```javascript
const express = require("express");
const app = express();

const port = 3000;

app.get("/", (req, res) =>
  res.json({
    name: "sanchit",
    email: "pasrichaasanchit@outlook.com",
  })
);

app.listen(port, () => console.log("express server running on port 3000"));
```

- Create a dockerfile to build an image

```dockerfile
FROM node:latest
WORKDIR /app
ADD . .
RUN npm install
CMD node index.js
```

Build an image using above file, Run:

```bash
docker build --tag api-service:latest .

//# this will create an image name api-service tagged latest
```

#### Now to use the built image in your Kubernetes cluster push the image to docker hub by building the image with same tag name as mentioned in docker repo in docker hub.

```bash
docker push sanchitpasricha/api-service:latest
```

- Now create a YAML file for deployment of K8s cluster (api-service.yaml)

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service-deployment
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api-service
  template:
    metadata:
      labels:
        app: api-service
    spec:
      containers:
        - name: api-service
          image: sanchitpasricha/api-service:latest
          resources:
            requests:
              memory: "32Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "500m"
          ports:
            - containerPort: 8080
```

- And apply the deployment by running:

```bash
kubectl apply -f api-service.yaml

# This will create a K8s cluster with 2 replicas.
```

#### Check the status of pods and deployments.

```bash
kubectl get pods

kubectl describe deployments

kubectl get deployments

```

- To bash into the underlying containers run:

```bash
kubectl exec --stdin --tty api-service-deployment-7fb4d8d66c-fb6s2 -- /bin/bash

# Enter the pod name

```

- Now to expose the clutter to external IP

```bash
kubectl expose deployment api-service-deployment --type=LoadBalancer --name=my-api-service
```

- Run

```bash
kubectl get service my-api-service
```

```output
NAME             TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
my-api-service   LoadBalancer   10.110.235.203   <pending>     8080:31068/TCP   90m
```

#### You won't we able to get EXTERNAL-IP in Minikube so it will keep showing <pending>
