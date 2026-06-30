import { useEffect, useState } from "react";
import { BRANDS } from "../../lib/consts.ts";
import { Button } from "../button/button.tsx";
import { Modal, type ModalProps } from "../modal/modal.tsx";
import { createInsightService } from "../../services/insightsService.ts";
import styles from "./add-insight.module.css";

type AddInsightProps = ModalProps & {
  onClose: (created: boolean) => void;
};

const Defaults = {
  brand: BRANDS[0].id,
  content: "",
};

export const AddInsight = (props: AddInsightProps) => {
  const [brand, setBrand] = useState(BRANDS[0].id);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (props.open) {
      setError(null);
      setBrand(Defaults.brand);
      setContent(Defaults.content);
    }
  }, [props.open]);

  const addInsight = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!content.trim()) {
      setError("Insight content cannot be empty.");
      return;
    }

    console.log("add insight", { brand, content });
    await createInsightService(brand, content);
    props.onClose(true);
  };

  const hanleBrandChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setBrand(parseInt(event.target.value));
  };

  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setContent(event.target.value);
    setError(null);
  };

  return (
    <Modal {...props}>
      <h1 className={styles.heading}>Add a new insight</h1>
      <form className={styles.form}>
        <label className={styles.field}>
          <select
            className={styles["field-input"]}
            value={brand}
            onChange={hanleBrandChange}
          >
            {BRANDS.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          Insight
          <textarea
            className={`${styles["field-input"]} ${
              error ? styles["field-input-error"] : ""
            }`}
            rows={5}
            placeholder="Something insightful..."
            value={content}
            onChange={handleContentChange}
          />
          {error !== null && (
            <span className={styles["field-input-error"]}>{error}</span>
          )}
        </label>
        <Button
          className={styles.submit}
          type="submit"
          label="Add insight"
          onClick={addInsight}
        />
      </form>
    </Modal>
  );
};
