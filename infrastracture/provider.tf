terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.47"
    }
  }

  backend "s3" {
    bucket       = "turkia-terraform-state"
    key          = "nyctaxi/terraform.tfstate"
    region       = "eu-west-1"
    encrypt      = true
    use_lockfile = true
  }
}

provider "aws" {
  region = var.region
}

# A second AWS connection, pinned to us-east-1, for the HTTPS certificate later
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}