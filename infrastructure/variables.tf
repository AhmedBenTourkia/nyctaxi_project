variable "region" {
    description = "AWS region where the S3 bucket lives"
    default = "eu-west-1"
}

variable "domain_name" {
    description = "Root domain managed in Route 53"
    default = "ahmedbentourkia.click"
}

variable "subdomain" {
    description = "Full address the site will be served at"
    default = "nyctaxi.ahmedbentourkia.click"
}

variable "bucket_name" {
    description = "Globally-unique S3 bucket name for the site"
    default = "nyctaxi-website-tourkia"
}