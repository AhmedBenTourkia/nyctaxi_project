# output "github_actions_role_arn"{
#     value = aws_iam_role.github_actions.arn
# }

 output "cloudfront_distribution_id" {
     value = aws_cloudfront_distribution.main.id
 }