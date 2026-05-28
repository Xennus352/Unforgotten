
import rawCareData from "@/lib/db/data.json";
import { CareCategory, CareData, MessageItem } from "@/types/message";

const careData = rawCareData as CareData;

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

interface GeneratedMessage {
  text: string;
  id: number;
}

/**
 * Picks a text variation and combines it dynamically to ensure variation.
 */
export function generateCareMessage(
  category: CareCategory,
  useCombinatorial: boolean = true,
): GeneratedMessage {
  const categoryMessages = careData.categories[category];

  if (!categoryMessages || categoryMessages.length === 0) {
    return { text: "ခလေးလေး စိတ်ချမ်းသာအောင် နေနော်။", id: 0 };
  }

  const coreMessage: MessageItem = getRandomItem(categoryMessages);

  if (useCombinatorial) {
    const opener = getRandomItem(careData.combinatorial_components.openers);
    const ending = getRandomItem(careData.combinatorial_components.endings);

    return {
      text: `${opener}${coreMessage.text}${ending}`,
      id: coreMessage.id,
    };
  }

  return {
    text: coreMessage.text,
    id: coreMessage.id,
  };
}
