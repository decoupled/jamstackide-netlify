export function netlify_oauth_build_authorize_url({
  client_id,
  redirect_uri,
  state,
}: {
  client_id: string
  redirect_uri: string
  state: string
}) {
  return (
    "https://app.netlify.com/authorize?" +
    "client_id=" +
    client_id +
    "&response_type=token" +
    "&redirect_uri=" +
    redirect_uri +
    "&state=" +
    state
  )
}
