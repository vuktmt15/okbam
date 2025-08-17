import {InputModal} from "@components/InputModal/index";
import {render} from "@testing-library/react";

describe("Button submit", () => {
  // mock text button
  const labelProps = "User name";

  beforeAll(() => {
    Object.defineProperty(window, "matchMedia", {
      value: jest.fn(() => {
        return {
          matches: true,
          addListener: jest.fn(),
          removeListener: jest.fn(),
        };
      }),
    });
  });
  const setup = () =>
    render(
      <InputModal
        keyValue=""
        label={labelProps}
        value=""
        onChange={() => jest.fn()}
        placeholder=""
      />,
    );

  it("render text button correctly", () => {
    const {getByText} = setup();
    expect(getByText("User name")).toBeTruthy();
  });
});
