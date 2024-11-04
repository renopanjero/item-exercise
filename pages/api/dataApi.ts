export interface Item {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

export const fetchData = async (): Promise<Item[]> => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (!response.ok) throw new Error("Response Status not ok");
    const data = await response.json();
    return data;
  } catch (err) {
    console.log("fetch: error", err);
    throw err;
  }
};
