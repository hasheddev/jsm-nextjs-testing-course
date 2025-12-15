import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { SocialFields } from "@/components/input-fields/SocialFields";
import { SocialLink } from "@/types/global";
import {
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/input-fields/Icons";

export const TestWrapper = ({
  initialSocials,
}: {
  initialSocials: SocialLink[];
}) => {
  const [socials, setSocials] = useState(initialSocials);

  const onSocialChange = (index: number, url: string) => {
    setSocials((prevSocials) =>
      prevSocials.map((social, i) =>
        i === index ? { ...social, url } : social
      )
    );
  };

  return <SocialFields onChange={onSocialChange} socials={socials} />;
};

describe("SocialFields", () => {
  const user = userEvent.setup();

  const mocksocials = [
    {
      platform: "x",
      url: "",
      Icon: TwitterIcon,
    },
    {
      platform: "linkedin",
      url: "",
      Icon: LinkedInIcon,
    },
    {
      platform: "github",
      url: "",
      Icon: GitHubIcon,
    },
  ];

  it("should show an arror message for an invalid URL immedialtely", async () => {
    render(<TestWrapper initialSocials={mocksocials} />);
    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i
    );
    await user.type(linkedInInput, "github.com/invalid");
    expect(
      screen.getByText(/Please enter a valid linkedin URL/i)
    ).toBeInTheDocument();
  });

  it("should clear error when valid url is entered", async () => {
    render(<TestWrapper initialSocials={mocksocials} />);
    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i
    );
    await user.type(linkedInInput, "github.com/invalid");
    expect(
      screen.getByText(/Please enter a valid linkedin URL/i)
    ).toBeInTheDocument();

    await user.clear(linkedInInput);
    await user.type(linkedInInput, "linkedin.com/shola");
    expect(
      screen.queryByText(/Please enter a valid linkedin URL/i)
    ).not.toBeInTheDocument();
  });

  it("should not show an arror message for empty input", async () => {
    render(<TestWrapper initialSocials={mocksocials} />);
    const linkedInInput = screen.getByPlaceholderText(
      /linkedin\.com\/username/i
    );
    await user.type(linkedInInput, "some text");
    expect(
      screen.getByText(/Please enter a valid linkedin URL/i)
    ).toBeInTheDocument();

    await user.clear(linkedInInput);
    expect(
      screen.queryByText(/Please enter a valid linkedin URL/i)
    ).not.toBeInTheDocument();
  });
});
