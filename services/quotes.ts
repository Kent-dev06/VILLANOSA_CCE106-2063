export type Quote = {
  text: string;
  author: string;
};

export class ApiRequestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

const RANDOM_QUOTE_URL = 'https://zenquotes.io/api/random';

// Fetches a quote with the current session token attached as a Bearer credential.
export async function getRandomQuote(accessToken: string): Promise<Quote> {
  try {
    if (!accessToken) {
      throw new ApiRequestError('Your session has expired. Please log in again.', 401);
    }

    const response = await fetch(RANDOM_QUOTE_URL, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status === 401) {
      throw new ApiRequestError('Your session is no longer valid. Please log in again.', 401);
    }

    if (response.status === 403) {
      throw new ApiRequestError('You do not have permission to view this quote.', 403);
    }

    if (!response.ok) {
      throw new ApiRequestError('The quote service is unavailable. Please try again.', response.status);
    }

    const data: unknown = await response.json();
    const quote = Array.isArray(data) ? data[0] : undefined;

    if (!quote || typeof quote.q !== 'string' || typeof quote.a !== 'string') {
      throw new ApiRequestError('No quote data was returned. Please try again.');
    }

    return { text: quote.q, author: quote.a };
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Unable to connect. Check your internet connection and try again.');
  }
}
