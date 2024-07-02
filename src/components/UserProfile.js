import React, { useState, useEffect } from "react";
import axios from "axios";
import questionsDataCN from "../dttcn.json";
import questionsDataEN from "../dttqen.json";
import { useNavigate, useLocation } from "react-router-dom";

const UserProfile = () => {
	const [incorrectQuestions, setIncorrectQuestions] = useState([]);
	const [results, setResults] = useState([]);
	const navigate = useNavigate();
	const location = useLocation();
	const user = location.state.user;
	const userId = user.userId;
	const [language, setLanguage] = useState("CN");
	const [selectedResultDetails, setSelectedResultDetails] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const getImagePath = (imageName) => {
		try {
			return require(`../images/${imageName}`);
		} catch (e) {
			console.error("Error loading image:", e);
			return ""; // Return an empty string or a default image path
		}
	};
	useEffect(() => {
		const questions =
			JSON.parse(localStorage.getItem("incorrectQuestions")) || [];
		setIncorrectQuestions(questions);
		const storedResults =
			JSON.parse(localStorage.getItem("mockTestResults")) || [];
		setResults(storedResults);
	}, []);
	console.log(incorrectQuestions);
	console.log(results);

	const navigateToSection = (section) => {
		navigate(`/march/${section}/${userId}`, { state: { user: user } });
	};

	const clearMockTestHistory = () => {
		localStorage.removeItem("mockTestResults");
		setResults([]);
		alert(
			language === "CN"
				? "模拟测试记录已成功清除。"
				: "Mock test history cleared successfully."
		);
	};

	const toggleLanguage = () =>
		setLanguage((prevLang) => (prevLang === "CN" ? "EN" : "CN"));

	// Dynamic text based on language state
	const texts = {
		userProfile: language === "CN" ? "用户资料" : "User Profile",
		allQuiz: language === "CN" ? "全题库练习" : "All Quiz",
		practice: language === "CN" ? "新内容开发中" : "developing",
		mockTest: language === "CN" ? "模拟测试" : "Mock Test",
		incorrectQuestions: language === "CN" ? "错误问题" : "Incorrect Questions",
		clearHistory:
			language === "CN" ? "清空模拟测试记录" : "Clear Mock Test History",
		toggleLanguage: language === "CN" ? "切换英文" : "切换中文",
		recentResults:
			language === "CN"
				? "模拟测试结果将显示在下方,点击任意结果将显示详情"
				: "Recent Mock Test Results",
		questionId: language === "CN" ? "问题 ID" : "Question ID",
	};

	const fetchQuestionDetails = (incorrectQuestionIds) => {
		// Ensure the correct dataset is used based on the current language
		const questionsData = language === "CN" ? questionsDataCN : questionsDataEN;

		// Use a temporary array to hold the fetched question details
		let details = [];

		incorrectQuestionIds.forEach((id) => {
			const questionDetail = questionsData.find(
				(question) => question.question_id === id
			);
			if (questionDetail) {
				details.push(questionDetail);
			}
		});

		// Update state only after all details are fetched
		setSelectedResultDetails(details);
		setIsModalOpen(true);
	};
	const redirectToExternal = () => {
		window.location.href = "https://nexttest-khaki.vercel.app";
	};
	const redirectToExternalcn = () => {
		window.location.href = "https://nexttest-khaki.vercel.app/ch";
	};
	return (
		<div className='flex flex-col justify-between h-screen bg-green-100'>
			<div className='px-8 pt-6 pb-4  max-w-s mx-auto overflow-auto'>
				<div className='mb-4 text-gray-600 italic text-sm text-left'>
					{language === "CN" ? (
						<>
							全题库练习包含792道题，有内建逻辑可以记录答题进度，错题，在全题库练习中可直接通过该页面的错题练习按钮进入错题练习，答对的错题将会从错题库中移除。{" "}
							<br />{" "}
							模拟测试为40分钟模考，实际考试时间为45分钟，所有模考记录将会显示在下方。
						</>
					) : (
						"The full question bank practice includes 792 questions, featuring built-in logic to record your progress and incorrect answers. You can directly access incorrect question practice through the button on this page, and correctly answered questions will be removed from your error bank. Mock tests are 40 minutes long, simulating the actual exam time of 45 minutes. All mock test records will be displayed below."
					)}
				</div>

				{/* Main content/buttons */}
				<button
					onClick={toggleLanguage}
					className='mb-2 bg-blue-300 px-3 py-1 rounded-full text-sm md:text-base shadow-sm'
				>
					{texts.toggleLanguage}
				</button>
				<button
					className='w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline'
					onClick={() => navigateToSection("allquiz")}
				>
					{texts.allQuiz}
				</button>
				<button
					className='w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline'
					onClick={() => navigateToSection("mocktest")}
				>
					{texts.mockTest}
				</button>
				<button
					className='w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
					onClick={clearMockTestHistory}
				>
					{texts.clearHistory}
				</button>

				<div className='mock-test-results flex-grow  mt-2'>
					<h3 className='bg-yellow-50  p-2'>{texts.recentResults}</h3>
					{results.map((result, index) => (
						<div
							key={index}
							className='bg-yellow-200  hover:bg-yellow-300 mb-1 mt-1 p-1 rounded-lg shadow cursor-pointer'
							onClick={() => fetchQuestionDetails(result.incorrectMockIds)}
						>
							{language === "CN" ? (
								<p>
									时间: {result.date}, 分数: {result.score} / {result.total}
								</p>
							) : (
								<p>
									Date: {result.date}, Score: {result.score} / {result.total}
								</p>
							)}
						</div>
					))}
				</div>
			</div>
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4'>
					<div className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4'>
						<div className='relative bg-white rounded-lg overflow-auto max-h-full w-full max-w-lg p-6'>
							{/* Close button now positioned relative to the modal container */}
							<div>
								<button
									className=' top-0 right-0   font-bold text-red-500 hover:text-red-700'
									onClick={() => setIsModalOpen(false)}
								>
									点此关闭详情窗口
								</button>
								<h4 className='bg-green-300'>
									{language === "CN"
										? "下滑查看完整问题详解"
										: "Incorrect Questions Details"}
								</h4>
							</div>
							{selectedResultDetails.map((detail, index) => (
								<div
									key={index}
									className='mb-4 p-4 rounded-lg bg-gray-100 shadow'
								>
									<p>{detail.question_text}</p>
									{detail["image_name"] !== "loader.gif" && (
										<img
											src={getImagePath(detail["image_name"])}
											alt='Quiz Illustration'
											className='w-2/3 max-w-sm mx-auto mb-4'
										/>
									)}
									<p>{`正确答案: ${
										detail[`option_${detail.correct_answer.toLowerCase()}`]
									}`}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			)}
			<div>
				<button
					className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4  rounded focus:outline-none focus:shadow-outline'
					onClick={redirectToExternalcn}
				>
					{language === "CN" ? "新题库中文版" : "Go to Next Test"}
				</button>
				<button
					className='w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mb-2 rounded focus:outline-none focus:shadow-outline'
					onClick={redirectToExternal}
				>
					{language === "CN" ? "新题库英语版" : "Go to Next Test"}
				</button>
			</div>
		</div>
	);
};

export default UserProfile;
