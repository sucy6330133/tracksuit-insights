import { IdCard, Trash2Icon } from "lucide-react";
import { cx } from "../../lib/cx.ts";
import type { Insight } from "../../schemas/insight.ts";
import { deleteInsightService } from "../../services/insightsService.ts";
import styles from "./insights.module.css";

type InsightsProps = {
  insights: Insight[];
  className?: string;
  refreshInsights?: () => void;
};

export const Insights = (
  { insights, className, refreshInsights }: InsightsProps,
) => {
  const deleteInsight = (id: number) => {
    return async (event: React.MouseEvent<SVGSVGElement>) => {
      event.preventDefault();
      console.log("delete insight", id);
      await deleteInsightService(id);
      if (refreshInsights) {
        refreshInsights();
      }
    };
  };

  return (
    <div className={cx(className)}>
      <h1 className={styles.heading}>Insights</h1>
      <div className={styles.list}>
        {insights?.length
          ? (
            insights.map(({ id, text, createdAt, brand }) => (
              <div className={styles.insight} key={id}>
                <div className={styles["insight-meta"]}>
                  <span>{brand}</span>
                  <div className={styles["insight-meta-details"]}>
                    <span>{createdAt.toString()}</span>
                    <Trash2Icon
                      className={styles["insight-delete"]}
                      onClick={deleteInsight(id)}
                    />
                  </div>
                </div>
                <p className={styles["insight-content"]}>{text}</p>
              </div>
            ))
          )
          : <p>We have no insight!</p>}
      </div>
    </div>
  );
};
