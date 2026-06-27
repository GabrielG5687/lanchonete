// Expõe um endpoint de status para autenticação no frontend via Firebase.
export function status(req, res) {
  return res.json({ status: 'ok', message: 'Auth via Firebase no frontend' })
}
