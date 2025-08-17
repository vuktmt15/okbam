import "./index.scss";
import {Col, Input, Row} from "antd";
import clsx from "clsx";
import React from "react";

interface InputModalProps {
  className?: string;
  label: string;
  placeholder: string;
  onChange: (value: any) => void;
  value: string;
  require?: boolean;
  keyValue: string;
}

export function InputModal(props: InputModalProps): JSX.Element {
  const {className, label, placeholder, onChange, value, require, keyValue} =
    props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange((prev: any) => ({
      ...prev,
      [keyValue]: e.target.value,
    }));
  };

  return (
    <Row className={clsx("input-modal-container", className)}>
      <Col md={6} className="label-item">
        {label}
        <span className="require">{require ? "*" : ""}</span>
      </Col>
      <Col md={18}>
        <Input
          placeholder={placeholder}
          onChange={handleChange}
          value={value}
        />
      </Col>
    </Row>
  );
}
