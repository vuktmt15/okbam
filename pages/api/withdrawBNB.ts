import type { NextApiRequest, NextApiResponse } from 'next';

// Check withdraw configuration
async function checkWithdrawConfig(): Promise<{ enabled: boolean; message?: string }> {
  try {
    const response = await fetch('http://159.223.91.231:8866/api/admin-configs');
    const configs = await response.json();
    
    if (Array.isArray(configs) && configs.length > 0) {
      const withdrawConfig = configs.find((config: any) => config.id === 1);
      
      if (withdrawConfig) {
        const isEnabled = withdrawConfig.status === 1;
        return {
          enabled: isEnabled,
          message: isEnabled ? undefined : "System is overloaded, please try again later!"
        };
      }
    }
    
    // Default to enabled if config not found
    return { enabled: true };
  } catch (error) {
    console.error('Error checking withdraw config:', error);
    // Default to enabled if error occurs
    return { enabled: true };
  }
}

// Proxy GET /api/withdrawBNB -> http://159.223.91.231:8866/api/withdrawBNB
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Check withdraw configuration first
  const configCheck = await checkWithdrawConfig();
  if (!configCheck.enabled) {
    return res.status(503).send(configCheck.message || "System is overloaded, please try again later!");
  }

  const { toAddress, amount, referrerId } = req.query;

  const url = `http://159.223.91.231:8866/api/withdrawBNB?toAddress=${encodeURIComponent(
    String(toAddress ?? '')
  )}&amount=${encodeURIComponent(String(amount ?? ''))}&referrerId=${encodeURIComponent(
    String(referrerId ?? '')
  )}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    res.status(response.status).send(text);
  } catch (error: any) {
    res.status(500).json({ message: 'Proxy error', error: String(error) });
  }
}


