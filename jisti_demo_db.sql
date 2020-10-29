-- phpMyAdmin SQL Dump
-- version 4.6.6deb5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 02, 2020 at 03:34 PM
-- Server version: 5.7.31-0ubuntu0.18.04.1
-- PHP Version: 7.3.20-1+ubuntu18.04.1+deb.sury.org+1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jisti_demo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `call_details`
--

CREATE TABLE `call_details` (
  `id` int(11) NOT NULL,
  `adminId` varchar(24) NOT NULL,
  `username` varchar(24) NOT NULL,
  `duration` varchar(24) NOT NULL,
  `subject` varchar(266) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `call_details`
--

INSERT INTO `call_details` (`id`, `adminId`, `username`, `duration`, `subject`, `create_date`, `update_date`) VALUES
(11, '9', 'Hello', '5', 'Testing Purpose', '2020-08-21 07:46:13', '2020-08-21 07:46:13'),
(12, '10', 'Hello', '3.0', 'IIII', '2020-08-21 07:48:44', '2020-08-21 07:48:44'),
(13, '9', 'asdf', '8.5', 'asdfas', '2020-08-21 07:58:38', '2020-08-21 07:58:38'),
(14, '9', 'jkjkjjk', '0:15', 'hjhjhjh', '2020-08-21 09:27:31', '2020-08-21 09:27:31'),
(15, '9', 'hkhjhjk', '0:26', 'jhkhk', '2020-08-21 09:30:26', '2020-08-21 09:30:26'),
(16, '9', 'gggg', '0:38', 'ggggggg', '2020-08-21 09:34:13', '2020-08-21 09:34:13'),
(17, '9', 'rasdf', '0:24', 'fasdfas', '2020-08-21 09:42:18', '2020-08-21 09:42:18'),
(18, '9', 'ccc', '0:16', 'cccc', '2020-08-21 09:45:24', '2020-08-21 09:45:24'),
(19, '9', 'asdf', '0:5', 'asdfasdfas', '2020-08-21 10:18:27', '2020-08-21 10:18:27'),
(20, '9', 'hhhhhhh', '0:5', 'hhhhhhh', '2020-08-21 10:19:15', '2020-08-21 10:19:15'),
(21, '9', 'sdf', '0:19', 'asdf', '2020-08-21 10:30:52', '2020-08-21 10:30:52'),
(22, '9', 'ascc', '0:7', 'cccc', '2020-08-21 10:32:42', '2020-08-21 10:32:42'),
(23, '9', 'Are', '0:3', 'arm', '2020-08-21 10:36:11', '2020-08-21 10:36:11'),
(24, '9', 'JJJJ', '1:17', 'jjj', '2020-08-24 05:59:33', '2020-08-24 05:59:33'),
(25, '9', 'Vipul', '0:22', 'testing', '2020-08-27 05:25:32', '2020-08-27 05:25:32'),
(26, '9', 'fdfd', '0:7', 'dfdfd', '2020-08-27 05:32:18', '2020-08-27 05:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(24) NOT NULL,
  `name` varchar(24) NOT NULL,
  `username` varchar(10) NOT NULL,
  `password` varchar(266) NOT NULL,
  `email` varchar(24) NOT NULL,
  `user_role` varchar(24) NOT NULL,
  `is_active` varchar(24) NOT NULL,
  `create_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `update_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `username`, `password`, `email`, `user_role`, `is_active`, `create_date`, `update_date`) VALUES
(9, 'vipul', 'vipul', 'sha1$e13d234c$1$de40f055c5c359fa14b8df78e088b891237ae372', 'vipul@gmail.com', 'SuperAdmin', '1', '2020-07-27 10:08:15', '2020-07-27 10:08:15'),
(10, 'topss', 'tops', 'sha1$d8802f78$1$67c2d72363203232b92f275c81d033edffed0934', 'tops@gmail.com', 'Admin', '1', '2020-07-27 10:19:07', '2020-07-27 10:19:07'),
(16, 'Nimesh', '123', 'sha1$7f4a459a$1$a6ba6c3e51b95891350e8fce9ae1267cb0c2a414', 'nimeh@gmail.com', 'Admin', '1', '2020-08-18 12:46:34', '2020-08-18 12:46:34');

-- --------------------------------------------------------

--
-- Table structure for table `user_feedback`
--

CREATE TABLE `user_feedback` (
  `id` int(11) NOT NULL,
  `name` varchar(24) NOT NULL,
  `feedback` varchar(24) NOT NULL,
  `adminId` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_feedback`
--

INSERT INTO `user_feedback` (`id`, `name`, `feedback`, `adminId`) VALUES
(25, 'Hello', '4', '9'),
(26, 'Hello', '4', '10'),
(27, 'asdf', '3', '9'),
(28, 'jkjkjjk', '3', '9'),
(29, 'hkhjhjk', '3', '9'),
(30, 'asdf', '5', '9'),
(31, 'hhhhhhh', '4', '9'),
(32, 'JJJJ', '4', '9'),
(33, 'Vipul', '4', '9'),
(34, 'fdfd', '4', '9');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `call_details`
--
ALTER TABLE `call_details`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_feedback`
--
ALTER TABLE `user_feedback`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `call_details`
--
ALTER TABLE `call_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;
--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(24) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;
--
-- AUTO_INCREMENT for table `user_feedback`
--
ALTER TABLE `user_feedback`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
