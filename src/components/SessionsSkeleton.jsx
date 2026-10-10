import styles from "../styles/sessionsSkeleton.module.css";

const Bone = ({ width, height }) => {
  return <span className="styles.bone" style={{ width, height }} />;
};

function SessionsSkeleton() {
  const groups = [1, 2, 3, 4, 5];
  const cards = [1, 2, 3, 4, 5];

  return (
    <div>
      {groups.map((group) => (
        <div key={group} className={styles.group}>
          <div className={styles.header}>
            <Bone width={40} height={58} />
            <div className={styles.lines}>
              <Bone width={160} height={14} />
              <Bone width={60} height={10} />
            </div>
          </div>
          <div className={styles.cards}>
            {cards.map((card) => (
              <div className={styles.card} key={card}>
                <div className={styles.row}>
                  <Bone width={50} height={18} />
                  <Bone width={64} height={16} />
                </div>
                <div className={styles.row}>
                  <Bone width={90} height={10} />
                  <Bone width={40} height={10} />
                </div>
                <div className={styles.row}>
                  <Bone width={110} height={10} />
                  <Bone width={30} height={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default SessionsSkeleton;
