import "./index.scss";
import {LoadingOutlined} from "@ant-design/icons";
import ApiUser from "@api/ApiUser";
import {IDataError} from "@api/Fetcher";
import {Upload, UploadProps, notification} from "antd";
import type {UploadRequestOption} from "rc-upload/lib/interface";
import React from "react";
import {useTranslation} from "react-i18next";
import {useMutation, useQuery} from "react-query";

interface IButtonUploadProps {
  children?: React.ReactNode;
  imageOptions: "avatar" | "banner";
}

export const IMAGE_FORMATS_ACCEPTED = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE_MAX_MB = 5;

export function ButtonUpload({children, imageOptions}: IButtonUploadProps) {
  const {t} = useTranslation();

  const uploadImage = useMutation<null, IDataError, FormData, unknown>(
    imageOptions === "avatar" ? ApiUser.uploadAvatar : ApiUser.uploadBanner,
  );

  const dataUser = useQuery("userProfile", ApiUser.getMe);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isAcceptedFile = IMAGE_FORMATS_ACCEPTED.includes(file.type);
    const isLimitedSizeImage = file.size < FILE_SIZE_MAX_MB * 1024 * 1024;

    if (!isLimitedSizeImage) {
      notification.error({
        message:
          t("profile.validate_image_smaller_than") + FILE_SIZE_MAX_MB + "MB",
        duration: 3,
      });
    }

    return isLimitedSizeImage && isAcceptedFile;
  };

  const handleUpload = ({file, onError, onSuccess}: UploadRequestOption) => {
    const formData = new FormData();

    formData.append(imageOptions, file as File);

    const handleSuccess = () => {
      onSuccess?.(t("profile.upload_success"));
      dataUser.refetch().then(() => {
        notification.success({
          message: t("profile.upload_success"),
          duration: 3,
        });
      });
    };

    uploadImage.mutate(formData, {
      onSuccess: handleSuccess,
      onError: (data) => {
        onError?.(new Error(data.errorMessage));
      },
    });
  };

  return (
    <Upload
      className="upload-button"
      listType="picture-card"
      customRequest={handleUpload}
      accept={IMAGE_FORMATS_ACCEPTED.join(",")}
      beforeUpload={beforeUpload}
      showUploadList={false}
    >
      {uploadImage.isLoading ? (
        <LoadingOutlined className="text-normal" spin />
      ) : (
        children
      )}
    </Upload>
  );
}
