import {ButtonSubmit} from "@components/ButtonSubmit";
import {ModalCustom} from "@components/ModalCustom";
import {RadioInput} from "@components/RadioInput";
import {uiLanguageOptions} from "@utils/constants/languageList";
import {useTranslation} from "react-i18next";

interface ISwitchLanguageProps {
  isModalVisible: boolean;
  language: string;
  setLang: (value: string) => void;
  handleSave: () => void;
}

export default function ModalSwitchLang({
  isModalVisible,
  language,
  setLang,
  handleSave,
}: ISwitchLanguageProps) {
  const {t} = useTranslation();

  return (
    <ModalCustom
      open={isModalVisible}
      onCancel={handleSave}
      width="100%"
      className="sm:max-w-[500px]"
    >
      <div>
        <div className="text-[18px] font-bold text-center pt-5">
          {t("account_setting.change_language")}
        </div>
        <RadioInput
          direction="vertical"
          options={uiLanguageOptions}
          className="pt-6 pb-5 pl-2"
          defaultValue={language}
          onChange={(e) => {
            setLang(e.target.value);
          }}
        />
        <ButtonSubmit label={t("common.save")} onClick={handleSave} />
      </div>
    </ModalCustom>
  );
}
