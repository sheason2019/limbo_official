import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "多数据源",
    Svg: require("@site/static/img/stack.svg").default,
    description: (
      <>
        <span>Limbo 客户端可以同时连接至多个服务器，</span>
        <span>来自多个服务器的数据会在您的设备上自动合并，</span>
        <span>就像您正在使用专用服务器提供的服务一样。</span>
      </>
    ),
  },
  {
    title: "信息安全",
    Svg: require("@site/static/img/lock_fill.svg").default,
    description: (
      <>Limbo 使用基于 NIST P-256 曲线的 ECC 加密为用户信息安全保驾护航。</>
    ),
  },
  {
    title: "数据同步",
    Svg: require("@site/static/img/arrow_repeat.svg").default,
    description: (
      <>
        <span>Limbo 账号可以迁移到多个不同的设备，</span>
        <span>这些账号会通过服务器实时进行安全的数据同步，</span>
        <span>默默为您带来无缝的跨设备应用体验。</span>
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className={styles.featureSvgContainer}>
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
