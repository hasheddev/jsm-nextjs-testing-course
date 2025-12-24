export * from "./router.mock";
export * from "./toast.mock";
export * from "./editor.mock";
export * from "./nextauth.mock";
export * from "./editdelete.mock";
export * from "./image.mock";
export * from "./link.mock";
export * from "./metric.mock";

export const resetAllMocks = () => {
  jest.clearAllMocks();
};

export const loremText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non lacinia mi, id accumsan quam. Fusce viverra malesuada nisi eu egestas. Donec ultricies dolor enim, quis interdum nisl elementum vitae. Ut quis ultricies sem, ut malesuada velit. Cras interdum auctor nisi. Donec venenatis enim in nibh placerat, eu luctus metus vulputate. Fusce id rutrum orci, ac porttitor felis. Sed mollis placerat turpis, vulputate maximus sapien porta in. Vestibulum semper felis tincidunt risus imperdiet laoreet. Sed vitae diam ut felis tempor malesuada. In sodales, lacus vel commodo gravida, purus sem laoreet nunc, vel blandit ipsum dui ut mauris. Pellentesque sit amet volutpat augue. Cras commodo elit vel mi rhoncus mattis. Vivamus.";
