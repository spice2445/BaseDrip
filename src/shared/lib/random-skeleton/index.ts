export const randomSkeleton = () => {
  const firstPercentW = random(0, 99);
  const firstPercentH = random(10, 20);
  const firstTopLeft = { x: '0', y: '0', rx: '0', ry: '0', width: `${firstPercentW}%`, height: firstPercentH };
  const secondTopRight = {
    x: '780',
    y: '0',
    rx: '0',
    ry: '0',
    width: `${100 - firstPercentW}%`,
    height: firstPercentH
  };
  const centerPercentH = random(20, 40);
  const firstCenter = { x: '0', y: '32', rx: '0', ry: '0', width: `${random(79, 99)}%`, height: centerPercentH };
  const firstBottomPercentW = random(30, 99);
  const firstBottomPercenth = random(15, 35);
  const firstBottom = {
    x: '0',
    y: '40',
    rx: '0',
    ry: '0',
    width: `${firstBottomPercentW}%`,
    height: firstBottomPercenth
  };
  const returnArray = [firstTopLeft, secondTopRight, firstCenter, firstBottom];

  //   if (firstBottomPercentW > 50) {
  //     returnArray.push(firstBottom);
  //   }

  return returnArray;
};

export const random = (bottom: number, top: number) => {
  return Math.floor(Math.random() * top) + bottom;
};
