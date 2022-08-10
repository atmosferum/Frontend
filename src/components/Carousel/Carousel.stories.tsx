import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Carousel, { CarouselChild } from './Carousel';
// @ts-ignore
export default {
  title: 'Carousel',
  component: Carousel,
} as ComponentMeta<typeof Carousel>;

export const Primary: ComponentStory<typeof Carousel> = (args) => {
  return (
    <div style={{ width: '700px' }}>
      <Carousel>
        <CarouselChild>1</CarouselChild>
        <CarouselChild>2</CarouselChild>
        <CarouselChild>3</CarouselChild>
      </Carousel>
    </div>
  );
};
