import styles from "./HomeFaq.module.scss"
import Accordion from "@material-ui/core/Accordion"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import Typography from "@material-ui/core/Typography"
import AddIcon from "@material-ui/icons/Add"
import CloseIcon from "@material-ui/icons/Close"
import { useState } from "react"

const FAQs = [
  {
    question: "What is Opvizor?",
    asnwer:
      "Opvizor is a minimal effort operation management system that enables you to keep track, analyze and manage all of your operations effortlessly."
  },
  {
    question: "Who is Opvizor for?",
    asnwer:
      "Opvizor is for small and medium sized companies such as Gyms, Schools, Fitness Centers etc. where there are some repetitive tasks that need to be managed digitally in an effortless manner."
  },
  {
    question: "Why use Opvizor over Jira?",
    asnwer:
      "Jira has a learning curve where you have to know how it works, it has too many options that you might not need and configuration to your desired needs can be tricky, where as Opvizor is a user friendly, minimal, simplified solution for managing hourly, daily and weekly tasks without any hassle."
  },
  {
    question: "Why use Opvizor over ERP?",
    asnwer:
      "Enterprise Resource Planning (ERP) Software is generally catered towards accounting, financial and invoice, things you may not need but still end up paying for these services anyway. Other than that you still might have to customize it to what you really need. Opvizor on the other hand has satisfactory out of the box features which you don't have to customize thus saving both time and money."
  }
]

const HomeFaq: React.FC = () => {
  const [expanded, setExpanded] = useState<string | false>()

  const handleChange =
    (panel: string) => (event: React.ChangeEvent<{}>, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  return (
    <section className={styles.faq}>
      <h1>Frequently Asked Questions</h1>
      <div className={styles.container}>
        {FAQs.map((faq, index) => (
          <Accordion
            key={index}
            expanded={expanded === `panel${index}`}
            onChange={handleChange(`panel${index}`)}
          >
            <AccordionSummary
              expandIcon={
                expanded === `panel${index}` ? <CloseIcon /> : <AddIcon />
              }
              aria-controls={`panel${index}a-content`}
              id={`pane${index}1a-header`}
            >
              <Typography className={styles.heading}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography className={styles.answer}>{faq.asnwer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}{" "}
      </div>
    </section>
  )
}

export default HomeFaq
