import { useState } from "react";
import { Button } from "../button/button.tsx";
import { AddInsight } from "../add-insight/add-insight.tsx";
import styles from "./header.module.css";

export const HEADER_TEXT = "Suit Tracker Insights";

type HeaderProps = {
  refreshInsights?: () => void;
};

export const Header = ({ refreshInsights }: HeaderProps) => {
  const [addInsightOpen, setAddInsightOpen] = useState(false);

  const handleAddInsightClose = (created: boolean) => {
    setAddInsightOpen(false);

    if (refreshInsights && created) {
      refreshInsights();
    }
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.inner}>
          <span className={styles.logo}>{HEADER_TEXT}</span>
          <Button
            label="Add insight"
            theme="secondary"
            onClick={() => setAddInsightOpen(true)}
          />
        </div>
      </header>
      <AddInsight
        open={addInsightOpen}
        onClose={() => handleAddInsightClose(false)}
      />
    </>
  );
};
