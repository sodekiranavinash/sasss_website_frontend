import AboutImage from "../assets/images/main.jpg";
import TextWithImage from "../components/TextWithImage";
import Hero from "../components/Hero";
import { 
  years18
} from "../scripts/data";
import TwoTable from "../components/TwoTable";
import TabMenu from "../components/TabMenu";
import { useSelector } from 'react-redux';
import { selectAlankaraSchedule } from '../store/slice/alankaraSlice';
import { selectPoojaTimings } from '../store/slice/poojaTimingsSlice';
import { makeTextBold } from "../components/common";
import LazyImageWrapper from "../components/LazyImageWrapper";
import  BannerImage from '../assets/images/banner.jpg'
import Timeline from "../components/TimeLine";
import Heading from "../components/Heading";
import { useTranslation } from 'react-i18next';
import { fetchCarouselImages } from "../scripts/userRequests";
import { useEffect, useState } from "react";


const HomePage = () => {
  const { t } = useTranslation(); // Access i18n instance
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  const alankaraSchedule = useSelector(selectAlankaraSchedule);
  const poojaTimings = useSelector(selectPoojaTimings);

  const showDateColumn1 = alankaraSchedule.some((item: any) => item.date);
  const showDateColumn2 = poojaTimings.some((item: any) => item.date);

  const headers1 = {
    col1: 'Date',
    col2: 'Day',
    col3: 'Alankara'
  };

  const headers2 = {
    col1: 'Date',
    col2: 'Timings',
    col3: 'Pooja'
  };

  const getCarouselImages = async () => {
    const response = await fetchCarouselImages();
    if (response.status === 200){
      setCarouselImages(response.images);
    }
    else{
      setCarouselImages([]);
    }
  }
  
  useEffect(() => {
    getCarouselImages();
  }, []);

  const contents = [
      makeTextBold(t('ayyappaDeeksha.dosInMala') as any ),
      makeTextBold(t('ayyappaDeeksha.dontInMala') as any )
    ]
    
  return (
    <div>
      <LazyImageWrapper src={BannerImage} alt={""}/>
      <TextWithImage
        heading={t('homePage.heading')}
        textPoints={t('homePage.text') as any}
        imageUrl={AboutImage}
        fullList={false}
      />

      <TabMenu
        heading={t('common.frequentlyAskedQuestions')}
        labels = {t('common.faqMenuItems') as any}
        contents={contents}
        length={3}
        backGround="bg-gray-100"
        fullList={false}
      />

      <Heading heading={t('common.ayyappaDeekshaTitles')} marginTop={"mt-8"}/>
      <Timeline years={years18} 
        descriptions={t('ayyappaDeeksha.ayyappaDeekshaTitles') as any} 
        fullList={false} 
      />

      <TwoTable
        heading1={t('common.alankaraSchedule')}
        heading2={t('common.poojaSchedule')}
        headers1={headers1}
        headers2={headers2}
        showDateColumn1={showDateColumn1}
        showDateColumn2={showDateColumn2}
        table1={alankaraSchedule}
        table2={poojaTimings}
      />

      <Hero
        heading={t('common.pictureGallery')}
        images={carouselImages}
      />
    </div>
  );
};

export default HomePage;