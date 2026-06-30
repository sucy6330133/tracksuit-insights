import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import type { Insight } from "../schemas/insight.ts";
import { fetchInsightsService } from "../services/insightsService.ts";
import styles from "./app.module.css";

export const App = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const loadInsights = async () => {
    try {
      const allInsights = await fetchInsightsService();
      setInsights(allInsights);
    } catch (error) {
      console.error("Failed to load insights:", error);
    }
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return (
    <main className={styles.main}>
      <Header refreshInsights={loadInsights} />
      <Insights
        className={styles.insights}
        insights={insights}
        refreshInsights={loadInsights}
      />
    </main>
  );
};
