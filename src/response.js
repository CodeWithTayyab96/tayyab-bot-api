export function ok(result) {
  return Response.json({ status: 200, success: true, result }, { status: 200 });
}

export function fail(status, error) {
  return Response.json({ status, success: false, result: { error } }, { status });
}
