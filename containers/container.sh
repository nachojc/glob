#!/bin/bash
##############################################

###INFO ......

###############################################
#TODO
#### logging steps


LOGFILE="/var/log/containersh.log"
WORKDIRECTORY=`dirname $0`
ENV="$WORKDIRECTORY/containervariables.env"
LOADENV=0
CONTAINERWVERSION="1.0.0"


function logging(){
  message = $1
  type = $2
  //if debug
  ec
}

function loadEnv(){
  ############################################3Running
  #Load environment variables
  . $ENV
}

function showEnv() {
    echo "File Environment $ENV:"
    cat $ENV
}

function loginAzurePortal() {
  echo "az login --service-principal --username ***** --password ****** --tenant *****  $AZURE_LOGIN_ARG"
  az login --service-principal --username $AZURE_USERNAME --password $AZURE_PASSWORD --tenant $AZURE_TENANT_ID  $AZURE_LOGIN_ARG
  _outputLoginAzurePortal=$?
}

function logoutAzurePortal(){
  az logout
}

function loginAzureRegistry(){
  echo "az acr login --name $AZURE_REGISTRY_NAME $AZURE_LOGIN_REGISTRY_CMD"
  az acr login --name $AZURE_REGISTRY_NAME $AZURE_LOGIN_REGISTRY_CMD
  _outputLoginAzureRegistry=$?
}

function loginAzureAKS(){
  echo "az aks get-credentials --resource-group $AZURE_AKS_RG --name $AZURE_AKS_CLUSTERNAME --overwrite-existing"
  az aks get-credentials --resource-group $AZURE_AKS_RG --name $AZURE_AKS_CLUSTERNAME --overwrite-existing
  _outputLoginAzureAKS=$?
}

function acrListRepo(){
  echo "az acr repository list --name $AZURE_REGISTRY_NAME -o table"
  az acr repository list --name $AZURE_REGISTRY_NAME -o table
}

function acrListTag(){
  reponame=$1

  if [ -z reponame ]; then
    echo "option -n has not been selected"
  else
    echo "az acr repository show --repository $reponame --name $AZURE_REGISTRY_NAME -o table"
    az acr repository show --repository $reponame --name $AZURE_REGISTRY_NAME -o table
    echo "az acr repository show-tags --repository $reponame --name $AZURE_REGISTRY_NAME -o table"
    az acr repository show-tags --repository $reponame --name $AZURE_REGISTRY_NAME --detail -o table
  fi

}

function showDNSZone(){
  echo "az network dns zone list --resource-group $AZURE_DNS_RG --output table"
  az network dns zone list --resource-group $AZURE_DNS_RG --output table
}

function showDomains(){
  zoneName=$1

  if [ -z $zoneName ]; then
    echo "option -y has not been selected"
  else
    echo "az network dns record-set a list --resource-group $AZURE_DNS_RG --zone-name $zoneName"
    az network dns record-set a list --resource-group $AZURE_DNS_RG --zone-name $zoneName --output table
  fi
}

function createDNSZone(){
  zoneName=$1

  if [ -z $zoneName ]; then
    echo "option -y has not been selected"
  else
    echo "az network dns zone create --resource-group $AZURE_DNS_RG --name $zoneName --if-none-match"
    az network dns zone create --resource-group $AZURE_DNS_RG --name $zoneName --if-none-match
  fi
}

function addRecordSetDNS(){
  zoneName=$1
  recordSetName=$2
  ipv4Address=$3

  if [[ (-z $zoneName) || (-z $recordSetName) || (-z $ipv4Address) ]]; then
    echo "one or more necessary parameters has not been indicated"
  else
    echo "az network dns record-set a list --resource-group $AZURE_DNS_RG --zone-name $zoneName | grep $recordSetName"
    az network dns record-set a list --resource-group $AZURE_DNS_RG --zone-name $zoneName | grep $recordSetName
    result=$?
    if [ $result -ne 0 ]; then
      echo "az network dns record-set a add-record --ipv4-address $ipv4Address --record-set-name $recordSetName --resource-group $AZURE_DNS_RG --zone-name $zoneName"
      az network dns record-set a add-record --ipv4-address $ipv4Address --record-set-name $recordSetName --resource-group $AZURE_DNS_RG --zone-name $zoneName
    else
      echo "record set already exist"
    fi
  fi
}

function listAKSCluster(){
  echo "az aks list --output table"
  az aks list --output table
}

function kubeGetContexts(){
  echo "kubectl config get-contexts"
  kubectl config get-contexts
}

function kubeUseContext(){
  contextName=$1

  if [ -z $contextName ]; then
    echo "option -y has not been selected"
  else
    echo "kubectl config use-context $contextName"
    kubectl config use-context $contextName
  fi
}

function listPods(){
  echo "kubectl get pods -A"
  kubectl get pods -A
}

function KubeConnectPod(){
  namespace=$1
  podName=$2

  if [[ (-z $namespace) || (-z $podName)]]; then
    echo "one or more necessary parameters has not been indicated"
  else
    echo "kubectl --namespace=$namespace exec $podName -it -- /bin/bash"
    kubectl --namespace=$namespace exec $podName -it -- /bin/bash
  fi
}

#Parameters $filepath,$tagname,$tagversion
function dockerShow(){
  filter=$1

  echo "Docker Show..."
  if [ -z $filter ]; then
      echo "docker image ls"
      docker image ls
  else
      echo "docker image ls"
      docker image ls | grep $filter
  fi

  exit $?
}

#Parameters $filepath,$tagname,$tagversion
function dockerBuild(){
  filepath=$1
  tagname=$2
  tagversion=$3
  dockerBuildArg="$4"
  echo "$tagname $tagversion"
  echo "Building Docker..."
  if [ -z $dockerBuildArg ]; then
      echo "docker build  -f $filepath -t ${AZURE_REGISTRY_URL}/${tagname}:$tagversion $DOCKER_BUILD_WORKSPACE"
      docker build  -f $filepath -t ${AZURE_REGISTRY_URL}/${tagname}:$tagversion $DOCKER_BUILD_WORKSPACE
  else
      echo "docker build  -f $filepath -t ${AZURE_REGISTRY_URL}/${tagname}:$tagversion --build-arg $dockerBuildArg $DOCKER_BUILD_WORKSPACE"
      docker build  -f $filepath -t ${AZURE_REGISTRY_URL}/${tagname}:$tagversion --build-arg $dockerBuildArg $DOCKER_BUILD_WORKSPACE
  fi

  exit $?
}
function dockerClean(){
  tagname=$1
  tagversion=$2
  echo "Cleaning Docker image..."
  docker image ls | grep $tagname
  echo "docker image rm ${AZURE_REGISTRY_URL}/${tagname}:$tagversion"
  docker image rm ${AZURE_REGISTRY_URL}/${tagname}:$tagversion
  exit $?
}
function dockerCleanAll(){
  filter="$1"
  if [ ! -z $filter ]; then
      echo "Cleaning Docker image with $filter..."
      docker image ls | grep $filter
      for i in `docker image ls | grep $filter | awk '{print $3}'`
      do
            docker image rm -f $i
      done
  else
      echo "No se ha insertado filtro"
  fi

}

function dockerTag(){
  tagname=$1
  tagversion=$2
  newtagname=$3
  newtagversion=$4
  echo "$tagname $tagversion $newtagname $newtagversion"
  echo "docker tag $AZURE_REGISTRY_URL/${tagname}:$tagversion $AZURE_REGISTRY_URL/${newtagname}:$newtagversion $DOCKER_TAG_ARGS"
  docker tag $AZURE_REGISTRY_URL/${tagname}:$tagversion $AZURE_REGISTRY_URL/${newtagname}:$newtagversion $DOCKER_TAG_ARGS
  _outputDockerTag=$?
}

function dockerPush(){
  tagname=$1
  tagversion=$2

  echo "docker push $AZURE_REGISTRY_URL/${tagname}:$tagversion $DOCKER_PUSH_ARGS"
  docker push $AZURE_REGISTRY_URL/${tagname}:$tagversion $DOCKER_PUSH_ARGS
  exit $?
}

function utilReadfile(){
  filename=$1
  variable=`cat $filename`
  echo "$variable"
}

function kubeDeployYaml(){
  loadEnv
  local filename=$1
  ###Default KBNAMESPACETEMPLATE
  ###Subtitute PARAM APPNAME in the template and write i

  echo "kubectl apply -f $filename"
  kubectl create -f $filename
  _outputkuberneteDeployYaml=$?
}

function kubeDeployAll(){
  ###Default KBNAMESPACETEMPLATE
  ###Subtitute PARAM APPNAME in the template and write i
  echo $1 $2 $3 $4
  tmptemplate=$(utilReadfile $1)
  tmptemplate=${tmptemplate//DEVTEAM/$DEV_TEAM}
  tmptemplate=${tmptemplate//APPNAME/$KUBERNETE_PROJECTNAME}
  tmptemplate=${tmptemplate//IMAGENAME/$2}
  tmptemplate=${tmptemplate//APPVERSION/$3}
  tmptemplate=${tmptemplate//PUBLICURLAPP/$4}

  echo "$tmptemplate" > ./containers/yamlfiles/push_deployment_$KUBERNETE_PROJECTNAME.yaml

  echo "$tmptemplate"

  echo "kubectl apply -f ./containers/yamlfiles/push_deployment_$KUBERNETE_PROJECTNAME.yaml"
  kubectl apply -f ./containers/yamlfiles/push_deployment_$KUBERNETE_PROJECTNAME.yaml
  _outputkuberneteNewNamespace=$?
}

function kubeNewNamespace(){
  loadEnv
  ###Default KBNAMESPACETEMPLATE
  ###Subtitute PARAM APPNAME in the template and write i
  tmptemplate=$(utilReadfile $KBNAMESPACETEMPLATE)
  tmptemplate=${tmptemplate//APPNAME/$KUBERNETE_PROJECTNAME}
  echo "$tmptemplate" > ./kubernetes/yamlfiles/push_namespace_$KUBERNETE_PROJECTNAME.yaml

  echo "$tmptemplate"

  echo "kubectl create -f ./kubernetes/push_namespace_$KUBERNETE_PROJECTNAME.yaml"
  kubectl create -f ./kubernetes/yamlfiles/push_namespace_$KUBERNETE_PROJECTNAME.yaml
  _outputkuberneteNewNamespace=$?
}
function kubeProxy(){
    echo "az aks browse --resource-group $AZURE_AKS_RG --name $AZURE_AKS_CLUSTERNAME"
    az aks browse --resource-group $AZURE_AKS_RG --name $AZURE_AKS_CLUSTERNAME
}

###LoginAzure function:
##########1-Login Azure Portal
##########2-Login Azure Registry
##########3-Login Azure AKS
function loginAzure(){
  _outputexit=1
  echo "Login in Azure Portal:"
  loginAzurePortal
  if [ $_outputLoginAzurePortal -eq 0 ]; then
    echo "Login in Azure Registry: $AZURE_REGISTRY_NAME"
    loginAzureRegistry
    if [ $_outputLoginAzureRegistry -eq 0 ]; then
      echo "Login in Azure kubernetes service: $AZURE_AKS_CLUSTERNAME+"
      loginAzureAKS
      if [ $_outputLoginAzurePortal -eq 0 ]; then
        _outputexit=0
      fi
    fi
  fi
}
function azInstall(){
  echo "Install Azure CLI (AZ Client)"
  echo "- brew update && brew install azure-cli"
  brew update && brew install azure-cli

  echo "Install Azure Kube"
  echo "1. Login in Azure"
  loginAzurePortal
  echo "2. Login Registry"
  loginAzureRegistry
  echo "2. Install aks"
  echo "- az aks install-cli"
  az aks install-cli
  echo "3. Login in AKS"
  loginAzureAKS
}

function showVersion {
    echo "containerw.sh version $CONTAINERWVERSION"
}
function do_help {
  cat << EOF
Usage: ./containerw.sh [-E environmentfile] -m METHOD [-f <DockerFilePath>][-n <DockerNameImage>][-v <DockerTagImage>] [-x <NewDockerNamgeImage>] [-y <newDockerTagImage>] [-u <URL HTTP access>] [-h]

      -h, -help,          --help                  Display help

      -m,                 --method                Set the internal Function to run {loginAzure | dockerBuildAndPushLatest | dockerTag | showEnv...}
                                                      -loginAzure: Command to login Portal, Registry and AKS cluster. Environment file needed with login/password information
                                                      -azInstall: Install Azure tools (only in MacOS)
                                                      -acrlistrepo: Show repos in the REgistry
                                                      -acrlisttag: Show tags in the repo (-n REPO)
                                                      -showDNSZone: List DNS zones
                                                      -showDomains: List all A record sets in a zone (-y ZONE)
                                                      -createDNSZone: Create a DNS zone (-y ZONE)
                                                      -addRecordSetDNS: Add an A record (-y ZONE, -x RECORD-SET_NAME, -v IPADDRESS)
                                                      -listAKSCluster: List managed Kubernetes clusters
                                                      -kubeGetContexts: Describe one or many contexts
                                                      -kubeUseContext: Sets the current-context in a kubeconfig file (-y CONTEXT_NAME)
                                                      -listPods: List all pods in ps output format
                                                      -KubeConnectPod: Execute a command in a container (-y NAMESPACE, -x POD_NAME)
                                                      -dockerShow: Show the local docker images (-e REGEX)
                                                      -dockerBuild: Wrapper docker build command, you need to pass the name and the path of the image (to tag), docker used the registry selected in enviroment file.
                                                      -dockerClean: Clean local images in the slave machine. You need to pass -n and -v options
                                                      -dockerTag: Retag an existing image. you need to pass -n -v options to select current image, and -x and -y for new tag
                                                      -dockerPush: Push the image to the repository. You need to pass -n and -v options.
                                                      -KubeNewNamespace: Create new namespace. the name is changed for the name of the proyect
                                                      -kubeDeployYaml: Deploy a standard yaml file in kubernetes cluster, you only need -f option.
                                                      -kubeDeployAll: Deploy a special yaml file with local variables (Image, namespace, URL) parameters
                                                      -kubeProxy: Enable kubeProxy
      -a,                 --dockerBuildArgumn     Set Arguments to use with build
      -e                  --regex                 Set conditions as a regular expression
      -n,                 --dockerNameImage       Docker image Name / ACR Repo
      -v,                 --dockerTagImage        Set the docker image Tag
      -x,                 --newDockerNameImage    Set the new docker tag for the DockerNameTag function.
      -y,                 --newDockerTagImage     Set the new docker tag for the DockerNameTag function.
      -f,                 --DockerFilePath        Set the docker File pathtoyamlfile
      -t,                 --KubeFilePath          Set the template yaml filename
      -u,                 --URLaccess             Set the URL access
      -V,                 --showVersion           Show version of script


Examples:
  1. Login Azure:
  ./container.sh -m loginAzure
  2. Docker Build
  ./containerw.sh -m dockerBuild [<-f containers/Dockerfiles/Dockerfile>] -n <docker_name> -v <docker_tag>
  3. Docker Clean
  ./containerw.sh -m dockerClean -n <docker_name> -v <docker_tag>
  4. Docker Retag
  ./containerw.sh -m dockerTag -n <DockerNameImage> -v <DockerTagImage> -x <NewDockerNameImage> -y <newDockerTagImage>
  5. Docker Push to Registry
  ./containerw.sh -m dockerPush -n <DockerNameImage> -v <DockerTagImage>
  6. Create new namespace in Kubernetes (AKS) Cluster
  ./containerw.sh -m kubeNewNamespace -t containers/yamlfiles/push_namespace.yaml
  7. Deploy a specific Yaml filename
  ./containerw.sh -m kubeDeployYaml -t <pathtoyamlfile>
  8. Deploy a special yaml standard filename
  ./containerw.sh -m kubeDeployYaml -t <pathtoyamlfile> -n <DockerNameImage> -v <DockerTagImage> -u <publicURL>
  9. Enable kubeProxy
  ./containerw.sh -m kubeProxy
EOF

}

if [ $LOADENV -eq 0 ]; then
  loadEnv
fi
###Reading parameters
while getopts a:e:E:f:k:m:n:v:x:y:t:u::Vh option
do
  case "${option}"
    in
      a) DOCKER_BUILD_ARG=${OPTARG};;
      e) REGEX=${OPTARG};;
      E) ENV=${OPTARG};;
      m) METHOD=${OPTARG};;
      f) DOCKERFILEPATH=${OPTARG};;
      k) KUBERNETE_PROJECTNAME=${OPTARG};;
      n) DOCKER_NAME=${OPTARG};;
      v) DOCKER_TAG=${OPTARG};;
      x) NEWDOCKERNAME=${OPTARG};;
      y) NEWDOCKERVERSION=${OPTARG};;
      p) PROJECTNAME=${OPTARG};;
      t) TEMPLATENAME=${OPTARG};;
      u) PUBLICHTTPURL=${OPTARG};;
      V) METHOD='showVersion';;
      h) METHOD='showHelp';;
  esac
done

case ${METHOD} in
    loginAzure)               loginAzure ;;
    azInstall)                azInstall ;;
    acrlistrepo)              acrListRepo ;;
    acrlisttag)               acrListTag $DOCKER_NAME ;;
    showDNSZone)              showDNSZone ;;
    showDomains)              showDomains $NEWDOCKERVERSION ;;
    createDNSZone)            createDNSZone $NEWDOCKERVERSION ;;
    addRecordSetDNS)          addRecordSetDNS $NEWDOCKERVERSION $NEWDOCKERNAME $DOCKER_TAG ;;
    listAKSCluster)           listAKSCluster ;;
    kubeGetContexts)          kubeGetContexts ;;
    kubeUseContext)           kubeUseContext $NEWDOCKERVERSION ;;
    listPods)                 listPods ;;
    KubeConnectPod)           KubeConnectPod $NEWDOCKERVERSION $NEWDOCKERNAME ;;
    dockerShow)               dockerShow $REGEX ;;
    dockerBuildAndPushLatest) dockerBuildAndPushLatest $DOCKERFILEPATH $DOCKER_NAME $DOCKER_TAG;;
    dockerBuild)              dockerBuild $DOCKERFILEPATH $DOCKER_NAME $DOCKER_TAG $DOCKER_BUILD_ARG;;
    dockerClean)              dockerClean $DOCKER_NAME $DOCKER_TAG;;
    dockerCleanAll)           dockerCleanAll $REGEX;;
    dockerTag)                dockerTag $DOCKER_NAME $DOCKER_TAG $NEWDOCKERNAME $NEWDOCKERVERSION;;
    dockerPush)               dockerPush $DOCKER_NAME $DOCKER_TAG;;
    kubeNewNamespace)         kubeNewNamespace $TEMPLATENAME;;
    kubeDeployYaml)           kubeDeployYaml $TEMPLATENAME $DOCKER_TAG;;
    kubeDeployAll)            kubeDeployAll $TEMPLATENAME $DOCKER_NAME $DOCKER_TAG $PUBLICHTTPURL;;
    kubeProxy)                kubeProxy ;;
    showEnv)                  showEnv;;
    showVersion)              showVersion;;
    *)                        do_help ;;
esac

exit $_outputexit
