import {IRootState} from "@app/redux/store";
import {ButtonGlobal} from "@components/ButtonGlobal";
import ModalSwitchLang from "@components/Layout/SwitchLanguage/ModalSwitchLang";
import {setLanguage} from "@slices/LanguageSlice";
import {uiLanguageOptions} from "@utils/constants/languageList";
import Image from "next/image";
import Arrow from "public/icon/ArrowDown.svg";
import {useCallback, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";

export function SwitchLanguage() {
  const {i18n} = useTranslation();
  const dispatch = useDispatch();
  const language = useSelector((state: IRootState) => state.language.language);
  const [lang, setLang] = useState(language);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOpenModal = () => {
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    await i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
    setIsModalVisible(false);
  };

  const RenderButtonLang = useCallback(
    () => {
      const selectedLanguage = languageSelect(language);
      const defaultLanguage = uiLanguageOptions[0]; // Fallback to first language
      const flagSrc = selectedLanguage?.flag || defaultLanguage?.flag || '';
      const label = selectedLanguage?.label || defaultLanguage?.label || 'EN';
      
      return (
        <ButtonGlobal onClick={handleOpenModal} className="px-[11px] h-[30px]">
          <div className="flex gap-[5px] justify-center">
            <Image
              src={flagSrc}
              alt="flag"
              width={20}
              height={20}
            />
            <span className="font-semibold text-[12px]">
              {label}
            </span>
            <Image src={Arrow} alt="arrow" width={8} height={6} />
          </div>
        </ButtonGlobal>
      );
    },
    [language],
  );

  const languageSelect = (lang: string) =>
    uiLanguageOptions?.find((val) => val.value === lang);

  return (
    <>
      <RenderButtonLang />
      <ModalSwitchLang
        isModalVisible={isModalVisible}
        language={language}
        setLang={setLang}
        handleSave={handleSave}
      />
    </>
  );
}
