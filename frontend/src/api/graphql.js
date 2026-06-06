export const GRAPHQL_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/graphql';
export const TELEMETRY_URL = import.meta.env.VITE_TELEMETRY_URL || 'ws://localhost:4000/telemetry';

export const graphqlRequest = async (query, variables = {}, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  if (result.errors) {
    throw new Error(result.errors.map((error) => error.message).join(', '));
  }
  return result.data;
};
