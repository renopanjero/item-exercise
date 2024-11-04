import Header from "@/components/Header";
import { fetchData, Item } from "./api/dataApi";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const { data, isLoading, error } = useQuery<Item[], Error>({
    queryKey: ["myData"],
    queryFn: fetchData,
  });

  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState<number[]>([]);
  const [filterCompleted, setFilterCompleted] = useState(false);
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (data) {
      setItems(data.slice(0, itemsPerPage));
      setCheckedItems(
        data.filter((item) => item.completed).map((item) => item.id)
      );
    }
  }, [data]);

  useEffect(() => {
    setCurrentPage(1);
    setItems(data?.slice(0, itemsPerPage) || []);
    setCheckedItems(
      data?.filter((item) => item.completed).map((item) => item.id) || []
    );
  }, [searchTerm, data]);

  const handleCheckboxChange = (id: number) => {
    setCheckedItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((itemId) => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleFilterCompletedChange = () => {
    setFilterCompleted((prev) => !prev);
  };

  const handleDoneClick = () => {
    setCheckedItems(
      data?.filter((item) => item.completed).map((item) => item.id) || []
    );
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return filterCompleted ? matchesSearch && item.completed : matchesSearch;
  });

  const loadMoreItems = useCallback(() => {
    if (data && currentPage * itemsPerPage < data.length) {
      const nextPageItems = data.slice(
        currentPage * itemsPerPage,
        (currentPage + 1) * itemsPerPage
      );
      setItems((prevItems) => [...prevItems, ...nextPageItems]);
      setCurrentPage((prevPage) => prevPage + 1);
    }
  }, [data, currentPage, itemsPerPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      if (scrollTop + windowHeight >= documentHeight - 100 && !isLoading) {
        loadMoreItems();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, loadMoreItems]);

  if (isLoading) return <p>Still loading...</p>;
  if (error) return <p>Query error</p>;

  return (
    <div>
      <div className="md:max-w-xl m-auto bg-color1">
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCompleted={filterCompleted}
          handleFilterCompletedChange={handleFilterCompletedChange}
          handleDoneClick={handleDoneClick}
        />
        <ul className="list-none space-y-2 bg-color3 py-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={checkedItems.includes(item.id) || item.completed}
                onChange={() => handleCheckboxChange(item.id)}
                className="w-6 h-6 mr-2 ml-4"
              />
              <li className="bg-color4 text-black rounded-sm mr-4 py-2 px-4 flex-grow">
                <span
                  className={
                    item.completed || checkedItems.includes(item.id)
                      ? "line-through text-gray-500"
                      : ""
                  }
                >
                  {item.title}
                </span>
              </li>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
}
