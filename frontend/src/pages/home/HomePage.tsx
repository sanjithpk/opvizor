import HomeIntro from "../../components/home/intro/HomeIntro"
import HomeCompanies from "../../components/home/companies/HomeCompanies"
import HomeBasic from "../../components/home/basic/HomeBasic"
import HomeServices from "../../components/home/services/HomeServices"
import HomePricing from "../../components/home/pricing/HomePricing"
import HomeFaq from "../../components/home/faq/HomeFaq"

const HomePage: React.FC = () => {
  return (
    <main>
      <HomeIntro />
      <HomeCompanies />
      <HomeBasic />
      <HomeServices />
      <HomePricing />
      <HomeFaq />
    </main>
  )
}

export default HomePage
