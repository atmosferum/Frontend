import { ComponentMeta, ComponentStory } from "@storybook/react";
import React from "react";
import DayTimeline from "./DayTimeline";

export default {
  title: "COMPONENT/DayTimeline",
  component: DayTimeline,
} as ComponentMeta<typeof DayTimeline>;

const Template: ComponentStory<typeof DayTimeline> = (args) => {
  return (
    <>
      <h1>column</h1>
      <div style={{ width: 600, display: "flex" }}>
        <DayTimeline {...args} />
      </div>
    </>
  );
};
export const Primary = Template.bind({});
Primary.args = {
  adminIntervals: [
    {
      fromHour: 6,
      toHour: 11,
    },
    {
      fromHour: 14,
      toHour: 18,
    },
  ],
  myIntervals: [
    {
      fromHour: 7,
      toHour: 9,
    },
    {
      fromHour: 10,
      toHour: 11,
    },
    {
      fromHour: 15,
      toHour: 18,
    },
  ],
};
