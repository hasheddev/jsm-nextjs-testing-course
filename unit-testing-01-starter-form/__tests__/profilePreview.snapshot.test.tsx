import { render } from "@testing-library/react";

import ProfilePreview from "@/components/ProfilePreview";
import {
  GitHubIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/input-fields/Icons";

describe("ProfilePreview Component", () => {
  const mockProfile = {
    firstName: "Shola",
    lastName: "Adebayo",
    email: "shola@example.com",
    description: "Js mastery testing course",
    imageUrl: "/test/image_1.webp",
  };

  const mocksocials = [
    {
      platform: "x",
      url: "x.com/shola",
      Icon: TwitterIcon,
    },
    {
      platform: "linkedin",
      url: "linkedin.con/shola",
      Icon: LinkedInIcon,
    },
    {
      platform: "github",
      url: "github.com/shola",
      Icon: GitHubIcon,
    },
  ];

  it("render correctly and match snapshot", () => {
    const { asFragment: profileFragment } = render(
      <ProfilePreview profile={mockProfile} socials={mocksocials} />
    );
    expect(profileFragment()).toMatchSnapshot();
  });
});
