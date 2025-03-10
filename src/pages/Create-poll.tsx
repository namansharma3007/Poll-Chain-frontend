import { Trash2 } from "lucide-react";
import { BigNumberish } from "ethers";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useBlockchain } from "../context/BlockchainContext";
import {
  blockchainServices,
  getContract,
} from "../services/blockchainServices";

import NoWalletError from "../components/NoWalletError";

type CreatePollForm = {
  title: string;
  question: string;
  options: string[];
  deadline: number | undefined;
};

export default function CreatePoll() {
  const { setGlobalPolls, setUserPolls, walletAddress, pollsDataUpdate } =
    useBlockchain();

  const pollChainContract = getContract();

  const [createPollForm, setCreatePollForm] = useState<CreatePollForm>({
    title: "",
    question: "",
    options: ["", ""],
    deadline: undefined,
  });

  const [lengthCheck, setLengthCheck] = useState<{
    title: number;
    question: number;
  }>({
    title: 0,
    question: 0,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "deadline") {
      const date = value + "T23:59:59.999Z";
      setCreatePollForm({
        ...createPollForm,
        deadline: new Date(date).getTime(),
      });
    } else {
      setCreatePollForm({ ...createPollForm, [name]: value });
      if (name === "title" || name === "question") {
        setLengthCheck({
          ...lengthCheck,
          [name]: value.length,
        });
      }
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...createPollForm.options];
    newOptions[index] = value;
    setCreatePollForm((prev) => ({ ...prev, options: newOptions }));
  };

  const addOption = () => {
    setCreatePollForm((prev) => ({ ...prev, options: [...prev.options, ""] }));
  };

  const removeOption = (index: number) => {
    setCreatePollForm((prev) => ({
      ...prev,
      options: createPollForm.options.filter((_, i) => i != index),
    }));
  };

  const cancelPollCreation = () => {
    setCreatePollForm({
      title: "",
      question: "",
      options: ["", ""],
      deadline: undefined,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const flag = formValidation(createPollForm);

    if (!flag.check) {
      toast.error(flag.message);
      return;
    }

    const creatingPoll = async (): Promise<void> => {
      try {
        await blockchainServices.createPoll(
          createPollForm.title,
          createPollForm.question,
          createPollForm.options,
          createPollForm.deadline!
        );
      } catch (error: any) {
        console.error("Error creating poll:", error.message);
      }
    };

    await toast.promise(creatingPoll(), {
      loading: "Creating poll...",
      success: "Poll created successfully",
      error: "Some error occurred while creating poll, Please refresh page and check once before creating a new poll",
    });

    pollsDataUpdate();
    cancelPollCreation();
  };

  const formValidation = (createPollForm: CreatePollForm) => {
    if (
      !createPollForm.title ||
      !createPollForm.question ||
      createPollForm.options.length === 0 ||
      !createPollForm.deadline
    ) {
      return {
        check: false,
        message: "Please fill in all the particulars",
      };
    }

    if (createPollForm.title.length < 6 || createPollForm.title.length > 30) {
      return {
        check: false,
        message:
          "Title length must be at least 6 characters and at max 30 characters",
      };
    }
    if (
      createPollForm.question.length < 6 ||
      createPollForm.question.length > 200
    ) {
      return {
        check: false,
        message:
          "Question length must be at least 10 characters and at max 200 characters",
      };
    }

    if (createPollForm.deadline < Date.now()) {
      return {
        check: false,
        message: "Deadline must be in the future",
      };
    }

    if (
      createPollForm.options.length < 2 ||
      createPollForm.options.length > 8
    ) {
      return {
        check: false,
        message: "There must be at least 2 options and at max 8 options",
      };
    }

    if (createPollForm.options.some((option) => option.length === 0)) {
      return {
        check: false,
        message: "Option text cannot be empty",
      };
    }

    if (createPollForm.options.some((option) => option.length > 50)) {
      return {
        check: false,
        message: "Option text cannot be more than 50 characters",
      };
    }

    return {
      check: true,
      message: null,
    };
  };

  if (!walletAddress) {
    return <NoWalletError />;
  }

  return (
    <section className="w-full min-h-screen h-max bg-gray-900 flex flex-col items-center gap-4 p-6 md:py-8 md:px-10">
      <div className="flex flex-col gap-4 w-full max-w-lg">
        <h2 className="text-gray-200 text-2xl font-semibold md:text-start text-center">
          Create New Poll
        </h2>
        <p className="text-gray-400 md:text-start text-center">
          Create a new poll and engage with the community
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg w-full"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title" className="text-gray-200 font-semibold">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={createPollForm.title}
              onChange={handleChange}
              placeholder="Enter your title"
              className="rounded-lg h-10 px-3 outline-none bg-gray-700 text-white"
              required
            />
            <div className="flex w-full justify-end mt-1">
              <p
                className={`text-xs font-semibold ${
                  lengthCheck.title > 30 ? "text-red-600" : "text-gray-400"
                }`}
              >
                Max: {lengthCheck.title}/30
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="question" className="text-gray-200 font-semibold">
              Question
            </label>
            <textarea
              name="question"
              id="question"
              rows={4}
              value={createPollForm.question}
              onChange={handleChange}
              placeholder="Enter your question"
              className="rounded-lg px-3 py-2 outline-none bg-gray-700 text-white"
              required
            ></textarea>
            <div className="flex w-full justify-end mt-1">
              <p
                className={`text-xs font-semibold ${
                  lengthCheck.question > 200 ? "text-red-600" : "text-gray-400"
                }`}
              >
                Max: {lengthCheck.question}/200
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="deadline" className="text-gray-200 font-semibold">
              Deadline
            </label>
            <input
              type="date"
              name="deadline"
              id="deadline"
              onChange={handleChange}
              min={
                new Date(Date.now() + 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
              value={
                createPollForm.deadline
                  ? new Date(createPollForm.deadline)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="rounded-lg h-10 px-3 outline-none bg-gray-700 text-white"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="options" className="text-gray-200 font-semibold">
              Options
            </label>
            {createPollForm.options.map((option, index) => (
              <div key={index} className="flex w-full gap-2">
                <input
                  type="text"
                  name="options"
                  id="options"
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="rounded-lg h-10 px-3 flex-1 outline-none bg-gray-700 text-white mb-1"
                  required
                />
                {createPollForm.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            ))}
            <div className="mt-2">
              <button
                type="button"
                onClick={addOption}
                className="text-purple-600 rounded-lg hover:outline hover:outline-purple-700 py-2 px-3"
              >
                + Add Option
              </button>
            </div>
          </div>

          <span className="w-full bg-gray-400 h-[0.2px] mt-1"></span>
          <div className="flex justify-end">
            <div className="flex gap-4 items-center">
              <button
                type="button"
                onClick={cancelPollCreation}
                className="px-3 py-2 h-max text-sm font-semibold text-white rounded-lg border border-gray-400 hover:bg-gray-400 hover:bg-opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 h-max text-sm font-semibold text-white rounded-lg hover:bg-purple-700 bg-purple-600"
              >
                Create Poll
              </button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
