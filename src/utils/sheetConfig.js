import clients from '../config/clients.json';

/**
 * Build a published Google Sheet CSV URL from components
 */
export function buildSheetUrl(sheetId, gid = '0') {
  if (!sheetId) return null;
  return `https://docs.google.com/spreadsheets/d/e/${sheetId}/pub?gid=${gid}&single=true&output=csv`;
}

/**
 * Parse URL parameters to get sheet configuration
 *
 * Supports:
 * - ?client=acme     → looks up in clients.json
 * - ?sheet=2PACX-xxx → uses sheet ID directly
 * - ?sheet=2PACX-xxx&gid=123 → with specific tab
 *
 * @returns {{ url: string|null, clientName: string|null, error: string|null }}
 */
export function getSheetConfig() {
  const params = new URLSearchParams(window.location.search);

  const clientSlug = params.get('client');
  const sheetId = params.get('sheet');
  const gid = params.get('gid') || '0';

  // Priority 1: Client slug from config
  if (clientSlug) {
    const client = clients[clientSlug];
    if (!client) {
      return {
        url: null,
        clientName: null,
        error: `Unknown client: "${clientSlug}". Check your URL or add this client to the config.`
      };
    }

    if (!client.sheetId) {
      return {
        url: null,
        clientName: client.name,
        error: `Client "${client.name}" has no sheet configured yet.`
      };
    }

    return {
      url: buildSheetUrl(client.sheetId, client.gid || '0'),
      clientName: client.name,
      error: null
    };
  }

  // Priority 2: Direct sheet ID
  if (sheetId) {
    return {
      url: buildSheetUrl(sheetId, gid),
      clientName: null,
      error: null
    };
  }

  // No params provided - show demo mode
  return {
    url: null,
    clientName: null,
    error: null
  };
}

/**
 * Get list of configured clients (for admin/debug purposes)
 */
export function getConfiguredClients() {
  return Object.entries(clients).map(([slug, config]) => ({
    slug,
    name: config.name,
    hasSheet: !!config.sheetId
  }));
}
