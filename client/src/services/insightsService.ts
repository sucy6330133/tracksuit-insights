export const fetchInsightsService = async () => {
  try {
    const response = await fetch(`/api/insights`);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch insights: ${response.status} ${response.statusText}`,
      );
    }

    const insights = await response.json();
    return insights;
  } catch (error) {
    throw new Error(`Failed to fetch insights: ${error}`);
  }
};

export const createInsightService = async (brand: number, content: string) => {
  try {
    const response = await fetch(`/api/insights/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ brand, content }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create insight: ${response.status} ${response.statusText}`,
      );
    }

    const insight = await response.json();
    return insight;
  } catch (error) {
    throw new Error(`Failed to create insight: ${error}`);
  }
};

export const deleteInsightService = async (id: number) => {
  try {
    const response = await fetch(`/api/insights/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to delete insight: ${response.status} ${response.statusText}`,
      );
    }
  } catch (error) {
    throw new Error(`Failed to delete insight: ${error}`);
  }
};
