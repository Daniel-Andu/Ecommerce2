-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: ecommerce_marketplace
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `addresses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `label` varchar(50) DEFAULT NULL,
  `full_name` varchar(200) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `address_line1` varchar(255) NOT NULL,
  `address_line2` varchar(255) DEFAULT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `country` varchar(100) NOT NULL DEFAULT 'Ethiopia',
  `is_default` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `addresses`
--

LOCK TABLES `addresses` WRITE;
/*!40000 ALTER TABLE `addresses` DISABLE KEYS */;
INSERT INTO `addresses` VALUES (1,13,'Home','admin mmm','098765433','bd',NULL,'bhir','bd city','123','Ethiopia',1,'2026-02-17 20:43:03','2026-02-17 20:43:03'),(2,22,'Home','dddd mmm','0976543217','dfgfhhghh',NULL,'hgsggs','sheger','54','Ethiopia',1,'2026-02-17 21:40:14','2026-02-17 21:40:14'),(3,22,'Home','ncnjbj','09876543223','gjjhj',NULL,'tyyty','bd','1234','Ethiopia',0,'2026-02-18 06:50:17','2026-02-18 06:50:17'),(4,23,'Home','DDDD','09876543','hhfvjv',NULL,'bd','city','21','Ethiopia',1,'2026-02-19 01:34:43','2026-02-19 01:34:43'),(5,24,'Home','fjdgjkjhkfgj','098377646','hfhf',NULL,'fhhdjh','qlkkdk','234','Ethiopia',1,'2026-02-19 10:22:50','2026-02-19 10:22:50'),(6,36,'Home','hhhhh','0987563465','ggfgghh',NULL,'ddf','kgbjjg','43','Ethiopia',1,'2026-02-19 13:10:59','2026-02-19 13:10:59'),(7,37,'Home','admin mmm','0912345678','bd','Kebele','bd','Amhara','21','Ethiopia',1,'2026-02-19 19:04:40','2026-02-19 19:04:40'),(8,2,'Home','John do','0712345678','Gonder','Kebele','gonder','Amhara','12','Ethiopia',1,'2026-02-20 06:28:40','2026-02-20 06:28:40');
/*!40000 ALTER TABLE `addresses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `image_url` text,
  `link_url` varchar(1000) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banners`
--

LOCK TABLES `banners` WRITE;
/*!40000 ALTER TABLE `banners` DISABLE KEYS */;
/*!40000 ALTER TABLE `banners` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `brands`
--

DROP TABLE IF EXISTS `brands`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `brands` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `logo` varchar(500) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `brands`
--

LOCK TABLES `brands` WRITE;
/*!40000 ALTER TABLE `brands` DISABLE KEYS */;
INSERT INTO `brands` VALUES (1,'Samsung','samsung',NULL,'2026-02-16 07:32:56');
/*!40000 ALTER TABLE `brands` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (4,37,10,1,'2026-02-20 04:54:23','2026-02-20 04:54:23');
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_items`
--

DROP TABLE IF EXISTS `cart_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cart_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cart_id` (`cart_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `cart_items_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `carts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cart_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=117 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_items`
--

LOCK TABLES `cart_items` WRITE;
/*!40000 ALTER TABLE `cart_items` DISABLE KEYS */;
INSERT INTO `cart_items` VALUES (1,19,1,NULL,1,'2026-02-16 11:23:02','2026-02-16 11:23:02'),(2,20,1,NULL,1,'2026-02-16 11:23:04','2026-02-16 11:23:04'),(3,21,1,NULL,1,'2026-02-16 11:23:10','2026-02-16 11:23:10'),(4,22,1,NULL,3,'2026-02-16 11:23:24','2026-02-16 11:23:24'),(5,25,1,NULL,1,'2026-02-16 11:23:50','2026-02-16 11:23:50'),(6,26,1,NULL,1,'2026-02-16 11:23:52','2026-02-16 11:23:52'),(8,29,1,NULL,1,'2026-02-16 11:53:26','2026-02-16 11:53:26'),(9,30,1,NULL,1,'2026-02-16 12:22:33','2026-02-16 12:22:33'),(10,31,1,NULL,1,'2026-02-16 12:22:38','2026-02-16 12:22:38'),(11,32,1,NULL,1,'2026-02-16 12:22:39','2026-02-16 12:22:39'),(12,38,1,NULL,1,'2026-02-16 14:34:47','2026-02-16 14:34:47'),(13,39,1,NULL,1,'2026-02-16 14:34:47','2026-02-16 14:34:47'),(14,42,1,NULL,4,'2026-02-16 18:17:59','2026-02-16 18:22:35'),(15,42,1,NULL,2,'2026-02-16 18:18:00','2026-02-16 18:19:01'),(16,43,1,NULL,1,'2026-02-16 19:14:12','2026-02-16 19:14:12'),(17,44,1,NULL,5,'2026-02-16 20:32:04','2026-02-16 21:04:21'),(18,45,1,NULL,2,'2026-02-16 21:50:49','2026-02-16 21:50:53'),(19,46,1,NULL,1,'2026-02-16 22:12:14','2026-02-16 22:12:14'),(21,53,1,NULL,4,'2026-02-17 07:18:41','2026-02-17 08:09:44'),(22,53,2,NULL,1,'2026-02-17 08:09:40','2026-02-17 08:09:40'),(23,53,2,NULL,1,'2026-02-17 08:09:42','2026-02-17 08:09:42'),(24,52,1,NULL,1,'2026-02-17 08:22:13','2026-02-17 08:22:13'),(50,60,1,NULL,1,'2026-02-18 00:10:00','2026-02-18 00:10:00'),(51,60,2,NULL,2,'2026-02-18 00:10:01','2026-02-18 00:10:01'),(52,60,3,NULL,1,'2026-02-18 00:10:01','2026-02-18 00:10:01'),(53,60,4,NULL,2,'2026-02-18 00:10:02','2026-02-18 00:10:02'),(54,61,1,NULL,1,'2026-02-18 00:17:09','2026-02-18 00:17:09'),(55,61,2,NULL,2,'2026-02-18 00:17:10','2026-02-18 00:17:10'),(56,61,3,NULL,1,'2026-02-18 00:17:10','2026-02-18 00:17:10'),(57,61,4,NULL,2,'2026-02-18 00:17:11','2026-02-18 00:17:11'),(58,62,1,NULL,1,'2026-02-18 05:43:03','2026-02-18 05:43:03'),(59,62,2,NULL,2,'2026-02-18 05:43:03','2026-02-18 05:43:03'),(60,62,3,NULL,1,'2026-02-18 05:43:04','2026-02-18 05:43:04'),(61,62,4,NULL,2,'2026-02-18 05:43:04','2026-02-18 05:43:04'),(62,63,1,NULL,1,'2026-02-18 05:43:49','2026-02-18 05:43:49'),(63,63,2,NULL,2,'2026-02-18 05:43:50','2026-02-18 05:43:50'),(64,63,3,NULL,1,'2026-02-18 05:43:50','2026-02-18 05:43:50'),(65,63,4,NULL,2,'2026-02-18 05:43:50','2026-02-18 05:43:50'),(66,64,1,NULL,1,'2026-02-18 05:45:15','2026-02-18 05:45:15'),(67,64,2,NULL,2,'2026-02-18 05:45:16','2026-02-18 05:45:16'),(68,64,3,NULL,1,'2026-02-18 05:45:16','2026-02-18 05:45:16'),(69,64,4,NULL,2,'2026-02-18 05:45:16','2026-02-18 05:45:16'),(70,65,1,NULL,1,'2026-02-18 05:46:10','2026-02-18 05:46:10'),(71,65,2,NULL,2,'2026-02-18 05:46:10','2026-02-18 05:46:10'),(72,65,3,NULL,1,'2026-02-18 05:46:11','2026-02-18 05:46:11'),(73,65,4,NULL,2,'2026-02-18 05:46:11','2026-02-18 05:46:11');
/*!40000 ALTER TABLE `cart_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart_sessions`
--

DROP TABLE IF EXISTS `cart_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart_sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  KEY `idx_session` (`session_id`),
  CONSTRAINT `cart_sessions_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart_sessions`
--

LOCK TABLES `cart_sessions` WRITE;
/*!40000 ALTER TABLE `cart_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `cart_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `carts`
--

DROP TABLE IF EXISTS `carts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `session_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session` (`session_id`),
  KEY `idx_user` (`user_id`),
  CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carts`
--

LOCK TABLES `carts` WRITE;
/*!40000 ALTER TABLE `carts` DISABLE KEYS */;
INSERT INTO `carts` VALUES (1,NULL,'bedca757-b790-4194-a64f-978cbdacac4a','2026-02-15 19:42:39','2026-02-15 19:42:39'),(2,NULL,'7a7294a2-ec14-48f8-887a-218f41545d8d','2026-02-15 19:42:41','2026-02-15 19:42:41'),(3,1,NULL,'2026-02-15 19:43:56','2026-02-15 19:43:56'),(4,NULL,'9374425c-ac90-42a4-8efb-80e48d7e997e','2026-02-15 19:48:33','2026-02-15 19:48:33'),(5,NULL,'64b93d6b-b361-44c5-a692-35865857679b','2026-02-15 19:48:34','2026-02-15 19:48:34'),(6,NULL,'aeaf451f-255c-45bc-a3ed-2afdb0eb40f2','2026-02-15 19:49:07','2026-02-15 19:49:07'),(7,NULL,'e7a913d4-9cf2-4327-8435-0e1fa4c33e43','2026-02-15 19:49:07','2026-02-15 19:49:07'),(8,NULL,'44c45ce6-9e7e-4db6-b861-cb210b926957','2026-02-15 19:56:48','2026-02-15 19:56:48'),(9,NULL,'e1a2ce13-9578-49b8-9343-7d1059bc8639','2026-02-15 19:56:48','2026-02-15 19:56:48'),(10,NULL,'502a944b-ad77-4fb3-a4b7-07043490b6b3','2026-02-16 05:43:19','2026-02-16 05:43:19'),(11,NULL,'4d893663-b2f6-49ff-8c2f-a634e3f8285a','2026-02-16 05:43:22','2026-02-16 05:43:22'),(12,NULL,'f84b8c93-c958-42f3-a4eb-8e0816cf4173','2026-02-16 07:38:01','2026-02-16 07:38:01'),(13,NULL,'95a00a82-1a81-4701-9d1c-8f941cfed830','2026-02-16 07:38:01','2026-02-16 07:38:01'),(14,5,NULL,'2026-02-16 08:14:29','2026-02-16 08:14:29'),(15,6,NULL,'2026-02-16 08:16:52','2026-02-16 08:16:52'),(16,7,NULL,'2026-02-16 08:26:02','2026-02-16 08:26:02'),(17,NULL,'1ea3b56b-fe57-4479-8a84-6df4fe1cd429','2026-02-16 08:33:03','2026-02-16 08:33:03'),(18,NULL,'8da1d9ac-1749-46c3-9a5e-477eacfd58d2','2026-02-16 08:33:07','2026-02-16 08:33:07'),(19,NULL,'7f289ed2-9f44-4b6b-9b33-b90e39340807','2026-02-16 11:23:01','2026-02-16 11:23:01'),(20,NULL,'e0df9de2-f1aa-415c-8657-99a00187a8df','2026-02-16 11:23:03','2026-02-16 11:23:03'),(21,NULL,'83aec620-c13c-40a8-a651-421db11bad0f','2026-02-16 11:23:10','2026-02-16 11:23:10'),(22,NULL,'65e4d760-bddb-4ec9-8b27-a93d2ae5f3be','2026-02-16 11:23:24','2026-02-16 11:23:24'),(23,NULL,'8156682e-2a85-4cd1-b1ca-ec1aba8a15c0','2026-02-16 11:23:27','2026-02-16 11:23:27'),(24,NULL,'1a6ee95c-346a-486b-83d2-2a50b4e91c15','2026-02-16 11:23:28','2026-02-16 11:23:28'),(25,NULL,'5801c2fb-b67c-4796-a451-e20fe3aca492','2026-02-16 11:23:50','2026-02-16 11:23:50'),(26,NULL,'b7883ef0-23a2-4753-8175-aa67d196d53f','2026-02-16 11:23:52','2026-02-16 11:23:52'),(27,NULL,'325f3a43-f07e-41cd-82de-8fd8c7d231fb','2026-02-16 11:24:02','2026-02-16 11:24:02'),(28,NULL,'a1cbca5e-7b9c-419e-83ec-99a560206498','2026-02-16 11:24:03','2026-02-16 11:24:03'),(29,9,NULL,'2026-02-16 11:51:47','2026-02-16 11:51:47'),(30,NULL,'9e806f31-5cec-4a05-b62a-58a7864e5ef7','2026-02-16 12:22:33','2026-02-16 12:22:33'),(31,NULL,'7ff34c08-42e7-4ebb-b82b-784f96d4aa87','2026-02-16 12:22:37','2026-02-16 12:22:37'),(32,NULL,'f40d1a56-c47c-42ba-9a11-3f750642f6d8','2026-02-16 12:22:38','2026-02-16 12:22:38'),(33,NULL,'cec1872f-1d72-4528-8907-5c85b3a9a268','2026-02-16 12:22:42','2026-02-16 12:22:42'),(34,NULL,'3a4a5577-a295-44ce-a4d5-5578384ef53a','2026-02-16 12:22:44','2026-02-16 12:22:44'),(35,10,NULL,'2026-02-16 12:24:08','2026-02-16 12:24:08'),(36,NULL,'871e25a2-e27f-4f1c-9395-dc1659e1b284','2026-02-16 14:33:54','2026-02-16 14:33:54'),(37,NULL,'e526bfcc-01ed-4b2d-a30d-ec559dffee53','2026-02-16 14:34:11','2026-02-16 14:34:11'),(38,NULL,'1875c312-18b9-47cb-8fe2-9aafefa45010','2026-02-16 14:34:45','2026-02-16 14:34:45'),(39,NULL,'397239a4-0173-4cea-978b-228b2f47cb05','2026-02-16 14:34:47','2026-02-16 14:34:47'),(40,NULL,'7ae545a0-6670-4593-a3a8-aa3b543c5e5b','2026-02-16 14:34:55','2026-02-16 14:34:55'),(41,NULL,'f0b0bff7-12cb-4461-b28a-259f6f210dec','2026-02-16 14:34:57','2026-02-16 14:34:57'),(42,11,NULL,'2026-02-16 18:17:12','2026-02-16 18:17:12'),(43,12,NULL,'2026-02-16 18:24:32','2026-02-16 18:24:32'),(44,14,NULL,'2026-02-16 19:50:13','2026-02-16 20:31:17'),(45,15,NULL,'2026-02-16 21:10:42','2026-02-16 21:10:42'),(46,16,NULL,'2026-02-16 21:54:01','2026-02-16 21:54:01'),(47,17,NULL,'2026-02-16 22:18:11','2026-02-16 22:18:11'),(48,18,NULL,'2026-02-16 23:12:42','2026-02-16 23:12:42'),(49,19,NULL,'2026-02-16 23:52:05','2026-02-16 23:52:05'),(50,2,NULL,'2026-02-16 23:56:52','2026-02-16 23:56:52'),(51,NULL,'sess_2gtehevop1n','2026-02-17 06:45:32','2026-02-17 06:45:32'),(52,13,NULL,'2026-02-17 06:45:35','2026-02-17 21:04:31'),(53,20,NULL,'2026-02-17 07:18:40','2026-02-17 07:18:40'),(60,NULL,'sess_lv6l2w3e73_1771373400702','2026-02-18 00:10:00','2026-02-18 00:10:00'),(61,NULL,'sess_c01ny4ezccd_1771373829507','2026-02-18 00:17:09','2026-02-18 00:17:09'),(62,NULL,'sess_gn7cob04exo_1771393383159','2026-02-18 05:43:03','2026-02-18 05:43:03'),(63,NULL,'sess_64jcygz5em_1771393429446','2026-02-18 05:43:49','2026-02-18 05:43:49'),(64,NULL,'sess_1bx1svr6kxa_1771393515482','2026-02-18 05:45:15','2026-02-18 05:45:15'),(65,NULL,'sess_ofejpfis62g_1771393570616','2026-02-18 05:46:10','2026-02-18 05:46:10'),(67,NULL,'sess_7dvj84rsiwe','2026-02-18 06:45:10','2026-02-18 06:45:10'),(69,NULL,'sess_1w05d6is772','2026-02-18 07:46:24','2026-02-18 07:46:24'),(72,NULL,'sess_usrkuehhval','2026-02-18 20:29:12','2026-02-18 20:29:12'),(76,22,NULL,'2026-02-18 23:47:09','2026-02-18 23:47:09'),(78,23,NULL,'2026-02-19 01:35:11','2026-02-19 01:35:11'),(80,NULL,'sess_818g3iqxe2c_1771469084992','2026-02-19 09:41:41','2026-02-19 09:41:41'),(82,NULL,'sess_6iegevoahz9','2026-02-19 10:32:00','2026-02-19 10:32:00');
/*!40000 ALTER TABLE `carts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `image` varchar(500) DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Electronics','electronics',NULL,NULL,1,'2026-02-15 18:17:26','2026-02-15 18:17:26'),(2,'Fashion','fashion',NULL,NULL,2,'2026-02-15 18:17:26','2026-02-15 18:17:26'),(3,'Home & Living','home-living',NULL,NULL,3,'2026-02-15 18:17:26','2026-02-15 18:17:26'),(4,'Beauty','beauty',NULL,NULL,4,'2026-02-15 18:17:26','2026-02-15 18:17:26');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text,
  `data` json DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `variant_id` int DEFAULT NULL,
  `product_name` varchar(500) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `product_id` (`product_id`),
  KEY `variant_id` (`variant_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `order_items_ibfk_3` FOREIGN KEY (`variant_id`) REFERENCES `product_variants` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,1,4,NULL,'phone',NULL,2,19999.96,39999.92,'2026-02-17 21:18:42'),(2,1,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-17 21:18:42'),(3,1,2,NULL,'Closes',NULL,4,19999.95,79999.80,'2026-02-17 21:18:42'),(4,1,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-17 21:18:42'),(5,2,4,NULL,'phone',NULL,2,19999.96,39999.92,'2026-02-17 23:06:26'),(6,2,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-17 23:06:27'),(7,2,2,NULL,'Closes',NULL,4,19999.95,79999.80,'2026-02-17 23:06:27'),(8,2,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-17 23:06:27'),(9,3,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 00:09:19'),(10,3,2,NULL,'Closes',NULL,2,19999.95,39999.90,'2026-02-18 00:09:20'),(11,3,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 00:09:20'),(12,3,4,NULL,'phone',NULL,2,19999.96,39999.92,'2026-02-18 00:09:20'),(13,4,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 06:05:36'),(14,4,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 06:05:43'),(15,4,4,NULL,'phone',NULL,2,19999.96,39999.92,'2026-02-18 06:05:43'),(16,5,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 06:50:50'),(17,5,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 06:50:50'),(18,5,4,NULL,'phone',NULL,2,19999.96,39999.92,'2026-02-18 06:50:50'),(19,6,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 08:21:04'),(20,6,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 08:21:04'),(21,7,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 11:30:55'),(22,7,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 11:30:57'),(23,8,3,NULL,'djhhfvh',NULL,2,7888.00,15776.00,'2026-02-18 22:21:32'),(24,9,10,NULL,'Home',NULL,1,5000000.00,5000000.00,'2026-02-18 22:37:38'),(25,10,8,NULL,'Car',NULL,1,99999999.94,99999999.94,'2026-02-18 22:40:19'),(26,10,3,NULL,'djhhfvh',NULL,1,7888.00,7888.00,'2026-02-18 22:40:19'),(27,10,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 22:40:19'),(28,11,8,NULL,'Car',NULL,1,99999999.94,99999999.94,'2026-02-18 23:47:08'),(29,11,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-18 23:47:08'),(30,12,1,NULL,'Samsung Galaxy S23',NULL,1,25000.00,25000.00,'2026-02-19 01:35:10'),(31,13,11,NULL,'hvhbhjhjjn',NULL,2,7688.00,15376.00,'2026-02-19 10:30:14'),(32,14,11,NULL,'hvhbhjhjjn',NULL,3,7688.00,23064.00,'2026-02-19 11:15:32'),(33,18,13,NULL,'iPhone',NULL,4,5000.00,20000.00,'2026-02-19 19:39:22'),(34,19,10,NULL,'Home',NULL,1,5000000.00,5000000.00,'2026-02-19 21:17:11'),(35,20,14,NULL,'Jacket',NULL,1,20.00,20.00,'2026-02-20 06:29:00'),(36,21,14,NULL,'Jacket',NULL,1,20.00,20.00,'2026-02-20 06:30:17'),(37,22,14,NULL,'Jacket',NULL,1,20.00,20.00,'2026-02-20 06:34:13'),(38,23,9,NULL,'PC',NULL,1,59999.91,59999.91,'2026-02-20 07:11:22'),(39,24,13,NULL,'iPhone',NULL,1,5000.00,5000.00,'2026-02-20 07:42:46'),(40,25,4,NULL,'phone',NULL,1,19999.96,19999.96,'2026-02-20 08:27:25'),(41,26,4,NULL,'phone',NULL,1,19999.96,19999.96,'2026-02-20 08:28:34'),(42,27,4,NULL,'phone',NULL,1,19999.96,19999.96,'2026-02-20 08:31:14');
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(50) NOT NULL,
  `user_id` int NOT NULL,
  `seller_id` int DEFAULT NULL,
  `status` enum('pending','confirmed','processing','shipped','delivered','cancelled','returned') DEFAULT 'pending',
  `subtotal` decimal(12,2) NOT NULL,
  `shipping_cost` decimal(12,2) DEFAULT '0.00',
  `tax` decimal(12,2) DEFAULT '0.00',
  `total` decimal(12,2) NOT NULL,
  `shipping_address_id` int DEFAULT NULL,
  `shipping_method` varchar(100) DEFAULT NULL,
  `payment_method` varchar(50) DEFAULT NULL,
  `payment_status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `chapa_txn_ref` varchar(255) DEFAULT NULL,
  `notes` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `shipping_address_id` (`shipping_address_id`),
  KEY `idx_order_number` (`order_number`),
  KEY `idx_user` (`user_id`),
  KEY `idx_seller` (`seller_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`),
  CONSTRAINT `orders_ibfk_3` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'ORD-1771363121954-XRLVCV',13,NULL,'delivered',152887.72,5.00,22933.16,175825.88,1,'standard','chapa','pending','chapa-ORD-1771363121954-XRLVCV-1771363123164',NULL,'2026-02-17 21:18:41','2026-02-18 11:32:00'),(2,'ORD-1771369586197-EXZPOX',22,NULL,'delivered',152887.72,5.00,22933.16,175825.88,2,'standard','chapa','pending','chapa-ORD-1771369586197-EXZPOX-1771369588957',NULL,'2026-02-17 23:06:26','2026-02-18 05:40:01'),(3,'ORD-1771373358778-XJ0OMZ',13,NULL,'confirmed',112887.82,5.00,16933.17,129825.99,1,'standard','chapa','pending','chapa-ORD-1771373358778-XJ0OMZ-1771373361464',NULL,'2026-02-18 00:09:18','2026-02-18 05:39:46'),(4,'ORD-1771394730617-GI22F8',22,NULL,'delivered',72887.92,5.00,10933.19,83826.11,2,'standard','chapa','pending','chapa-ORD-1771394730617-GI22F8-1771394747319',NULL,'2026-02-18 06:05:30','2026-02-18 11:31:53'),(5,'ORD-1771397450107-8BVRYZ',22,NULL,'delivered',72887.92,5.00,10933.19,83826.11,3,'standard','chapa','pending','chapa-ORD-1771397450107-8BVRYZ-1771397451839',NULL,'2026-02-18 06:50:50','2026-02-18 11:31:48'),(6,'ORD-1771402864327-HVDEU4',13,NULL,'delivered',32888.00,5.00,4933.20,37826.20,1,'standard','chapa','pending','tx-ORD-1771402864327-HVDEU4-1771402865258-78a5f8ef',NULL,'2026-02-18 08:21:04','2026-02-18 11:31:44'),(7,'ORD-1771414254370-RIS3VY',13,NULL,'delivered',32888.00,5.00,4933.20,37826.20,1,'standard','chapa','pending','tx-ORD-1771414254370-RIS3VY-1771414261668-0224db37',NULL,'2026-02-18 11:30:54','2026-02-18 11:31:36'),(8,'ORD-1771453291068-0VCSBT',22,NULL,'pending',15776.00,5.00,2366.40,18147.40,2,'standard','chapa','pending',NULL,NULL,'2026-02-18 22:21:31','2026-02-18 22:21:31'),(9,'ORD-1771454258931-0DLS7C',22,NULL,'pending',5000000.00,5.00,750000.00,5750005.00,2,'standard','chapa','pending',NULL,NULL,'2026-02-18 22:37:38','2026-02-18 22:37:38'),(10,'ORD-1771454417420-TBZEBR',22,NULL,'pending',100032887.94,5.00,15004933.19,115037826.13,2,'standard','chapa','pending',NULL,NULL,'2026-02-18 22:40:17','2026-02-18 22:40:17'),(11,'ORD-1771458428658-6LSBF7',22,NULL,'delivered',100024999.94,5.00,15003749.99,115028754.93,2,'standard','chapa','paid','tx-ORD-1771458428658-6LSBF7-1771458428999-30ae1cc2',NULL,'2026-02-18 23:47:08','2026-02-19 10:19:40'),(12,'ORD-1771464910357-8M7AU8',23,NULL,'shipped',25000.00,5.00,3750.00,28755.00,4,'standard','chapa','paid','tx-ORD-1771464910357-8M7AU8-1771464911735-b505a73f',NULL,'2026-02-19 01:35:10','2026-02-19 10:20:13'),(13,'ORD-1771497014250-503Q0H',24,NULL,'confirmed',15376.00,5.00,2306.40,17687.40,5,'standard','chapa','paid','tx-ORD-1771497014250-503Q0H-1771497015138-819a53cf',NULL,'2026-02-19 10:30:14','2026-02-19 10:30:20'),(14,'ORD-1771499732808-FTN4ZL',24,NULL,'pending',23064.00,5.00,3459.60,26528.60,5,'standard','chapa','pending',NULL,NULL,'2026-02-19 11:15:32','2026-02-19 11:15:32'),(18,'ORD-1771529962284-EH2X5W',37,22,'confirmed',20000.00,5.00,3000.00,23005.00,7,NULL,'chapa','paid','tx-ORD-1771529962284-EH2X5W-1771529962831-8903c299',NULL,'2026-02-19 19:39:22','2026-02-19 19:39:27'),(19,'ORD-1771535830894-YY3JFM',37,20,'delivered',5000000.00,5.00,750000.00,5750005.00,7,NULL,'chapa','pending','tx-ORD-1771535830894-YY3JFM-1771535831463-c8566858',NULL,'2026-02-19 21:17:10','2026-02-20 05:44:14'),(20,'ORD-1771568940305-0TA877',2,1,'pending',20.00,5.00,3.00,28.00,8,NULL,'chapa','pending','tx-ORD-1771568940305-0TA877-1771568941149-09f1f076',NULL,'2026-02-20 06:29:00','2026-02-20 06:29:02'),(21,'ORD-1771569017658-0C07HP',2,1,'pending',20.00,5.00,3.00,28.00,8,NULL,'chapa','pending','tx-ORD-1771569017658-0C07HP-1771569017876-ee694edd',NULL,'2026-02-20 06:30:17','2026-02-20 06:30:18'),(22,'ORD-1771569252879-42DOL7',2,1,'pending',20.00,5.00,3.00,28.00,8,NULL,'chapa','pending','tx-ORD-1771569252879-42DOL7-1771569253300-76ab030d',NULL,'2026-02-20 06:34:12','2026-02-20 06:34:13'),(23,'ORD-1771571482458-XPI80V',2,20,'pending',59999.91,5.00,8999.99,69004.90,8,NULL,'chapa','pending','tx-ORD-1771571482458-XPI80V-1771571483165-89f21c0d',NULL,'2026-02-20 07:11:22','2026-02-20 07:11:23'),(24,'ORD-1771573366644-93MJ9S',2,22,'pending',5000.00,5.00,750.00,5755.00,8,NULL,'chapa','pending','tx-ORD-1771573366644-93MJ9S-1771573367749-ce8678bc',NULL,'2026-02-20 07:42:46','2026-02-20 07:42:48'),(25,'ORD-1771576045160-0SDIBD',2,18,'pending',19999.96,5.00,2999.99,23004.95,8,NULL,'chapa','pending','tx-ORD-1771576045160-0SDIBD-1771576045469-3c48a714',NULL,'2026-02-20 08:27:25','2026-02-20 08:27:25'),(26,'ORD-1771576114563-C2E6DN',2,18,'pending',19999.96,5.00,2999.99,23004.95,8,NULL,'chapa','pending','tx-ORD-1771576114563-C2E6DN-1771576114867-594b27ee',NULL,'2026-02-20 08:28:34','2026-02-20 08:28:35'),(27,'ORD-1771576274190-PDPC5X',2,18,'pending',19999.96,5.00,2999.99,23004.95,8,NULL,'chapa','pending','tx-ORD-1771576274190-PDPC5X-1771576274518-1df3454d',NULL,'2026-02-20 08:31:14','2026-02-20 08:31:14');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_logs`
--

DROP TABLE IF EXISTS `payment_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int DEFAULT NULL,
  `chapa_txn_ref` varchar(255) DEFAULT NULL,
  `amount` decimal(12,2) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `raw_response` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `payment_logs_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_logs`
--

LOCK TABLES `payment_logs` WRITE;
/*!40000 ALTER TABLE `payment_logs` DISABLE KEYS */;
INSERT INTO `payment_logs` VALUES (1,11,'tx-ORD-1771458428658-6LSBF7-1771458428999-30ae1cc2',115028754.93,'demo','{\"demo\": true}','2026-02-18 23:47:09'),(2,12,'tx-ORD-1771464910357-8M7AU8-1771464911735-b505a73f',28755.00,'demo','{\"demo\": true}','2026-02-19 01:35:12'),(3,13,'tx-ORD-1771497014250-503Q0H-1771497015138-819a53cf',17687.40,'demo','{\"demo\": true}','2026-02-19 10:30:17'),(4,18,'tx-ORD-1771529962284-EH2X5W-1771529962831-8903c299',23005.00,'demo','{\"demo\": true}','2026-02-19 19:39:24'),(5,22,'tx-ORD-1771569252879-42DOL7-1771569253300-76ab030d',28.00,'initialized','{\"data\": {\"checkout_url\": \"https://checkout.chapa.co/checkout/payment/UjVNHIoGlM421K1Zt9HmH4ZXE1KIW1ETI1UfotOmB1PIR\"}, \"status\": \"success\", \"message\": \"Hosted Link\"}','2026-02-20 06:34:15'),(6,23,'tx-ORD-1771571482458-XPI80V-1771571483165-89f21c0d',69004.90,'initialized','{\"data\": {\"checkout_url\": \"https://checkout.chapa.co/checkout/payment/9ESioxkHWP0KQ6mKinZ93N423ZefkGWC0LlL5fnGF4ho9\"}, \"status\": \"success\", \"message\": \"Hosted Link\"}','2026-02-20 07:11:24'),(7,24,'tx-ORD-1771573366644-93MJ9S-1771573367749-ce8678bc',5755.00,'initialized','{\"data\": {\"checkout_url\": \"https://checkout.chapa.co/checkout/payment/3PrT8AMqAbNsdVVK4kgrZmogYGX9EHv0N2fdlIvJsvjHD\"}, \"status\": \"success\", \"message\": \"Hosted Link\"}','2026-02-20 07:42:49'),(8,27,'tx-ORD-1771576274190-PDPC5X-1771576274518-1df3454d',23004.95,'initialized','{\"data\": {\"checkout_url\": \"https://checkout.chapa.co/checkout/payment/OPX0JJndtEud1991X2MzZNzRBCRSuh4nUUUhNxwsoPLyI\"}, \"status\": \"success\", \"message\": \"Hosted Link\"}','2026-02-20 08:31:17');
/*!40000 ALTER TABLE `payment_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `transaction_ref` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending',
  `payment_method` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `transaction_ref` (`transaction_ref`),
  KEY `idx_transaction_ref` (`transaction_ref`),
  KEY `idx_order_id` (`order_id`),
  CONSTRAINT `payment_transactions_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `image_url` varchar(500) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `sort_order` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
INSERT INTO `product_images` VALUES (8,1,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop','Samsung Galaxy S23 - Front',0,'2026-02-17 06:42:54'),(9,1,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop','Samsung Galaxy S23 - Back',1,'2026-02-17 06:42:54'),(10,1,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop','Samsung Galaxy S23 - Side',2,'2026-02-17 06:42:54'),(11,2,'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop','Fashion Item - Front',0,'2026-02-17 06:43:12'),(12,2,'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=500&h=500&fit=crop','Fashion Item - Back',1,'2026-02-17 06:43:12'),(20,1,'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500','Samsung Galaxy S23',0,'2026-02-17 20:17:54'),(21,2,'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500','Closes shoes',0,'2026-02-17 20:17:54'),(22,3,'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500','djhhfvh headphones',0,'2026-02-17 20:17:54'),(24,4,'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=600','Phone image',0,'2026-02-17 20:21:17'),(27,8,'https://www.bing.com/th/id/OIP.LLevjYOOGDLfAnRvBzA2TQHaEK?w=244&h=211&c=8&rs=1&qlt=90&o=6&cb=defcache1&pid=3.1&rm=2&defcache=1','Car',0,'2026-02-17 22:02:25'),(28,9,'https://www.bing.com/th/id/OIP.dqhm8RkM_BnTvUyKcPRX6gHaF7?w=239&h=211&c=8&rs=1&qlt=90&o=6&cb=defcache1&pid=3.1&rm=2&defcache=1','PC',0,'2026-02-17 22:21:30'),(29,10,'https://th.bing.com/th/id/OIP.Yqn-qZNyc5jabKgC1FaRPgHaE8?w=236&h=180&c=7&r=0&o=7&cb=defcache2&pid=1.7&rm=3&defcache=1','Home ',0,'2026-02-18 06:19:00'),(30,1,'https://via.placeholder.com/500x500?text=Product+1','Product 1 Main Image',1,'2026-02-19 11:09:35'),(31,1,'https://via.placeholder.com/500x500?text=Product+1+Angle+2','Product 1 Side View',2,'2026-02-19 11:09:35'),(32,2,'https://via.placeholder.com/500x500?text=Product+2','Product 2 Main Image',1,'2026-02-19 11:09:35'),(33,2,'https://via.placeholder.com/500x500?text=Product+2+Angle+2','Product 2 Side View',2,'2026-02-19 11:09:35'),(34,3,'https://via.placeholder.com/500x500?text=Product+3','Product 3 Main Image',1,'2026-02-19 11:09:35'),(35,13,'http://localhost:5000/uploads/products/images-1771520057069-820930928.PNG','iPhone',0,'2026-02-19 16:54:25'),(36,14,'http://localhost:5000/uploads/products/images-1771568536439-695050720.jpg','Jacket',0,'2026-02-20 06:22:16');
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_variants`
--

DROP TABLE IF EXISTS `product_variants`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_variants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `attributes` json DEFAULT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `product_variants_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_variants`
--

LOCK TABLES `product_variants` WRITE;
/*!40000 ALTER TABLE `product_variants` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_variants` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  `subcategory_id` int DEFAULT NULL,
  `brand_id` int DEFAULT NULL,
  `name` varchar(500) NOT NULL,
  `slug` varchar(500) NOT NULL,
  `description` text,
  `short_description` varchar(500) DEFAULT NULL,
  `base_price` decimal(12,2) NOT NULL,
  `sale_price` decimal(12,2) DEFAULT NULL,
  `sku` varchar(100) DEFAULT NULL,
  `stock_quantity` int DEFAULT '0',
  `weight` decimal(10,2) DEFAULT NULL,
  `dimensions` varchar(100) DEFAULT NULL,
  `tags` varchar(500) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `status` enum('draft','pending','approved','rejected') DEFAULT 'pending',
  `view_count` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `subcategory_id` (`subcategory_id`),
  KEY `brand_id` (`brand_id`),
  KEY `idx_slug` (`slug`),
  KEY `idx_category` (`category_id`),
  KEY `idx_seller` (`seller_id`),
  KEY `idx_status` (`status`),
  KEY `idx_featured` (`is_featured`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`) ON DELETE CASCADE,
  CONSTRAINT `products_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_3` FOREIGN KEY (`subcategory_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `products_ibfk_4` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,1,1,NULL,1,'Samsung Galaxy S23','samsung-galaxy-s23','Latest Samsung smartphone',NULL,25000.00,NULL,NULL,100,NULL,NULL,NULL,0,1,'approved',59,'2026-02-16 07:33:59','2026-02-20 06:13:03'),(2,1,2,NULL,NULL,'Closes','closes-1771286169051','hhdfjdf',NULL,19999.95,NULL,NULL,50,NULL,NULL,NULL,0,1,'approved',35,'2026-02-16 23:55:33','2026-02-20 06:12:24'),(3,1,4,NULL,NULL,'djhhfvh','djhhfvh-1771312307660','dghdfh',NULL,7888.00,NULL,NULL,30,NULL,NULL,NULL,0,1,'approved',24,'2026-02-17 07:11:16','2026-02-19 19:51:29'),(4,18,1,NULL,NULL,'phone','phone--1771315953146','fjjkkbkf',NULL,19999.96,NULL,NULL,22,NULL,NULL,NULL,0,1,'approved',88,'2026-02-17 08:12:33','2026-02-20 08:31:14'),(8,20,4,NULL,NULL,'Car','car-1771365745642','good vehicle',NULL,99999999.94,NULL,NULL,20,NULL,NULL,NULL,1,1,'approved',10,'2026-02-17 22:02:25','2026-02-20 07:42:20'),(9,20,1,NULL,NULL,'PC','pc-1771366890294','Modern pc for Customers',NULL,59999.91,NULL,NULL,14,NULL,NULL,NULL,1,1,'approved',37,'2026-02-17 22:21:30','2026-02-20 07:11:22'),(10,20,3,NULL,NULL,'Home','home--1771395538944','Modern home ',NULL,5000000.00,NULL,NULL,9,NULL,NULL,NULL,1,1,'approved',26,'2026-02-18 06:18:58','2026-02-20 07:41:47'),(11,20,2,NULL,NULL,'hvhbhjhjjn','hvhbhjhjjn-1771415298560','tgjktjkj',NULL,7688.00,NULL,NULL,5,NULL,NULL,NULL,1,1,'approved',40,'2026-02-18 11:48:18','2026-02-19 19:55:20'),(13,22,1,NULL,NULL,'iPhone','iphone-1771520057184','good product',NULL,3000.00,5000.00,NULL,5,NULL,NULL,'phone',1,1,'approved',8,'2026-02-19 16:54:17','2026-02-20 08:30:40'),(14,1,2,NULL,NULL,'Jacket','jacket-1771568536486','Beautiful wear for summer season',NULL,3000.00,20.00,NULL,2,NULL,NULL,'style',1,1,'approved',6,'2026-02-20 06:22:16','2026-02-20 06:34:13');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotion_products`
--

DROP TABLE IF EXISTS `promotion_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotion_products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `promotion_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `promotion_id` (`promotion_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `promotion_products_ibfk_1` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `promotion_products_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotion_products`
--

LOCK TABLES `promotion_products` WRITE;
/*!40000 ALTER TABLE `promotion_products` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotion_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `promotions`
--

DROP TABLE IF EXISTS `promotions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `promotions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `type` enum('percentage','fixed','flash_sale') DEFAULT 'percentage',
  `value` decimal(10,2) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `promotions`
--

LOCK TABLES `promotions` WRITE;
/*!40000 ALTER TABLE `promotions` DISABLE KEYS */;
/*!40000 ALTER TABLE `promotions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `return_requests`
--

DROP TABLE IF EXISTS `return_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `return_requests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `user_id` int NOT NULL,
  `reason` text,
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `return_requests_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `return_requests_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `return_requests`
--

LOCK TABLES `return_requests` WRITE;
/*!40000 ALTER TABLE `return_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `return_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `order_id` int DEFAULT NULL,
  `rating` tinyint NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `comment` text,
  `status` enum('pending','approved','rejected') DEFAULT 'approved',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `product_id` (`product_id`,`user_id`,`order_id`),
  KEY `user_id` (`user_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_3` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,14,NULL,4,NULL,'hhfhhg','approved','2026-02-16 20:32:37','2026-02-16 20:32:37'),(2,1,15,NULL,4,NULL,'hhhh','approved','2026-02-16 21:51:13','2026-02-16 21:51:13'),(3,2,22,NULL,5,NULL,'good','approved','2026-02-17 13:37:46','2026-02-17 13:37:46'),(4,4,22,NULL,5,NULL,'good','approved','2026-02-17 21:38:28','2026-02-17 21:38:28'),(5,9,13,NULL,4,NULL,'Good products','approved','2026-02-17 22:30:15','2026-02-17 22:30:15');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sellers`
--

DROP TABLE IF EXISTS `sellers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sellers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `business_name` varchar(255) NOT NULL,
  `business_email` varchar(255) DEFAULT NULL,
  `business_phone` varchar(50) DEFAULT NULL,
  `business_address` text,
  `tax_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `balance` decimal(12,2) DEFAULT '0.00',
  `pending_balance` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `sellers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sellers`
--

LOCK TABLES `sellers` WRITE;
/*!40000 ALTER TABLE `sellers` DISABLE KEYS */;
INSERT INTO `sellers` VALUES (1,2,'food','edi@gmail.com','0735377','bdu',NULL,'approved',0.00,0.00,'2026-02-15 19:46:18','2026-02-16 23:45:56'),(2,3,'food','edi@gmail.com','0735377','Bahir Dar',NULL,'approved',0.00,0.00,'2026-02-16 05:51:11','2026-02-17 07:34:55'),(3,1,'John Electronics Store','seller@marketplace.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 07:32:25','2026-02-16 07:32:25'),(4,5,'EDI','dndualem21@gmail.com','098765433','bd',NULL,'pending',0.00,0.00,'2026-02-16 07:38:36','2026-02-16 07:38:36'),(5,4,'Marketplace Electronics','seller@marketplace.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 08:23:03','2026-02-16 08:23:03'),(6,8,'EDI','em21@gmail.com','5996557676','bdu',NULL,'approved',0.00,0.00,'2026-02-16 08:27:12','2026-02-17 07:34:51'),(7,9,'EDI','e21@gmail.com','59965576667','fgjnjhjj',NULL,'approved',0.00,0.00,'2026-02-16 11:24:47','2026-02-19 11:53:05'),(10,10,'EDgjjh','cfhghge21@gmail.com','599655760','bbb',NULL,'approved',0.00,0.00,'2026-02-16 12:23:46','2026-02-17 07:34:48'),(11,11,'ED','ed@gmail.com','07353779999','bd',NULL,'approved',0.00,0.00,'2026-02-16 14:36:31','2026-02-18 06:54:53'),(12,14,'hghghhhg','fhh@gmail.com','907998','bd',NULL,'approved',0.00,0.00,'2026-02-16 20:15:35','2026-02-17 07:34:45'),(13,15,'EDI','edi@gmail.com','0735377','bd',NULL,'approved',0.00,0.00,'2026-02-16 21:08:18','2026-02-19 10:17:40'),(14,16,'EDI','edfjjgi@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 21:53:28','2026-02-17 07:34:41'),(15,17,'EDI','edfgi@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 22:15:47','2026-02-19 10:17:27'),(16,18,'EDI','dgdfggedi@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 22:32:04','2026-02-17 07:34:37'),(17,19,'EDI','dgggedi@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-16 23:16:58','2026-02-18 06:54:49'),(18,20,'ghhhhh','dnialem21@gmail.com',NULL,'dfgfhhghh',NULL,'approved',0.00,0.00,'2026-02-17 07:18:20','2026-02-17 07:34:33'),(19,21,'gbbbbnn','andum21@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-17 08:15:20','2026-02-17 08:21:21'),(20,22,'Shoping','dan@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-17 13:36:08','2026-02-17 13:44:46'),(21,24,'fjjfjgj','dani@gmail.com',NULL,NULL,NULL,'approved',0.00,0.00,'2026-02-19 02:47:30','2026-02-19 10:17:32'),(22,36,'help','dniand21@gmail.com','0987651239','helping',NULL,'approved',0.00,0.00,'2026-02-19 13:06:17','2026-02-19 13:07:52');
/*!40000 ALTER TABLE `sellers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `static_pages`
--

DROP TABLE IF EXISTS `static_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `static_pages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `static_pages`
--

LOCK TABLES `static_pages` WRITE;
/*!40000 ALTER TABLE `static_pages` DISABLE KEYS */;
/*!40000 ALTER TABLE `static_pages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `password_hash` varchar(255) DEFAULT NULL,
  `first_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) DEFAULT NULL,
  `role` enum('customer','seller','admin') DEFAULT 'customer',
  `profile_image` varchar(500) DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `phone_verified` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `remember_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'edi@gmail.com','0735377','$2a$10$FtjGYGKWvv/.qrR7YM1Obe9OLPrMaPU2S.tcV0Ql/iMgvPtowXgue','dddd','dudu','customer',NULL,0,0,1,NULL,'2026-02-15 19:43:34','2026-02-15 19:44:29'),(2,'andualem21@gmail.com',NULL,'$2a$10$VvcjOdWyrSXSsM.OnHI1Zum4lpLRDAsv4m29lOlxfKCebFKMRS1k.','admin','mmm','seller',NULL,0,0,1,NULL,'2026-02-15 19:46:18','2026-02-15 19:46:18'),(3,'ndualem21@gmail.com',NULL,'$2a$10$Rah9wk4KaEnxFsig4OMeN.qr0QZwtK2vWUjz4YGyuFntcAFNOinEi','Seller one','Products','seller',NULL,0,0,1,NULL,'2026-02-16 05:51:11','2026-02-17 07:34:55'),(4,'seller@marketplace.com',NULL,'123456','John','Seller','seller',NULL,1,0,1,NULL,'2026-02-16 07:31:37','2026-02-16 07:31:37'),(5,'dniandualem21@gmail.com',NULL,'$2a$10$DI3mtOCWc30Z4OVwMOWSHePanwMzcNl2JRyK7Gh7uC1oBRECRYEAu','admin','mmm','seller',NULL,0,0,1,NULL,'2026-02-16 07:38:36','2026-02-16 07:38:36'),(6,'hchvh@gmail.com','098765486','$2a$10$aoqudG1.DQcJLuICnMa0/ebuM.xbKT7xeBcNONYHlq9tqd41n2qPC','bknjk','mmmncnvnnv','customer',NULL,0,0,1,NULL,'2026-02-16 08:16:40','2026-02-16 08:16:40'),(7,'dngghualem21@gmail.com','098765656','$2a$10$cqqNFTgxQx42mPxlMmUS2.Ti1vOVnAhNZH3tML/yJuwneXK57w2FW','admindvnnvnbn','mmmbnfngb','customer',NULL,0,0,1,NULL,'2026-02-16 08:25:35','2026-02-16 08:25:35'),(8,'dniandm21@gmail.com',NULL,'$2a$10$J47Lhg1MsXrc7svOGkyMU.dn56VNVQPOkCjnxRmUuKmlrJVR182JS','dhfhgh','bcbvb','seller',NULL,0,0,1,NULL,'2026-02-16 08:27:12','2026-02-17 07:34:51'),(9,'dndm21@gmail.com',NULL,'$2a$10$dpjSby/T4G0NY0GsJydI6exeSvOWwXXjrBNPSd5pDKpT/OqDzbLoa','jjgjjhjhj','vbmnfdbn','seller',NULL,0,0,1,NULL,'2026-02-16 11:24:47','2026-02-19 11:53:06'),(10,'dn21@gmail.com',NULL,'$2a$10$WA6vhdbI6UXOR.ztgLXncusZXPWEwNMdRXnlUVtAaRtBwdJveIqmW','mbfgnfk','bnmnksk','seller',NULL,0,0,1,NULL,'2026-02-16 12:23:46','2026-02-17 07:34:48'),(11,'gh@gmail.com','095866778','$2a$10$eXzm59TQHXRG3H.XvIVIKOcth8n0CckfJaKqZZAW0eVBSxRYAFyda','Daniel','fgvhhjjh','seller',NULL,0,0,1,NULL,'2026-02-16 14:36:31','2026-02-18 06:54:53'),(12,'dalem21@gmail.com','098765433','$2a$10$OtE/uA2EgXo9ZEfEO1Ha/.PC7wWpbXrmjMQsqCY2yxiC7/qc/47CK','Sew','New','customer',NULL,0,0,1,NULL,'2026-02-16 18:24:13','2026-02-16 18:24:13'),(13,'admin@gmail.com','','$2a$12$kiRlwR3g1pXyNohp5JlrPu0zSTsiCRY9hefgyfmil38k1t8sNiomq','Admin','User','admin','/uploads/profile-images/profile-1771358646582-580124901.jpg',0,0,1,NULL,'2026-02-16 19:10:40','2026-02-20 05:41:07'),(14,'ffgg@gmail.com',NULL,'$2a$10$VXJZ522kyZAws8byDyc3BehsHUDzqbZWMsI7.YN9AuT.AcSJ55Jja','hfhhghg','hhfjdhhdf','seller',NULL,0,0,1,NULL,'2026-02-16 20:15:35','2026-02-17 07:34:45'),(15,'dd@gmail.com',NULL,'$2a$10$3NNEecyiCaiKzO30V/Ky9u.yX9fyd1weYw70Tnp9j/uoOGd1MiQ/2','nnbnnn','fhhhfhh','seller',NULL,0,0,1,NULL,'2026-02-16 21:08:18','2026-02-19 10:17:40'),(16,'edfjjgi@gmail.com',NULL,'$2a$10$gX6ppoLD920uYr9lpdF4w.aJdTIGjuKUHMMANfP0K/SGwkPi0lg5q','Ghdhfnf','vfjjjvjjb','seller',NULL,0,0,1,NULL,'2026-02-16 21:53:28','2026-02-17 07:34:41'),(17,'edfgi@gmail.com',NULL,'$2a$10$sFEP/NnuvW2sgBWawm5yIuWB61GkYnArbKoBsG6g7jzPJOx9u.r82','yeyrty','hhvhghh','seller',NULL,0,0,1,NULL,'2026-02-16 22:15:47','2026-02-19 10:17:27'),(18,'dgdfggedi@gmail.com',NULL,'$2a$10$b4ueW5yfbNq.GQhgeXD4LOcECYJTORzoyM0.0b5CeSsTgagHNhPBu','gjjkhkkh','gkfjjfdjf','seller',NULL,0,0,1,NULL,'2026-02-16 22:32:03','2026-02-17 07:34:37'),(19,'dgggedi@gmail.com',NULL,'$2a$10$/BtlMxYz6.77/yeW/CL.Zes/l3K9VWutvcoJq8OvBipPQj2t/ID22','dom','frue','seller',NULL,0,0,1,NULL,'2026-02-16 23:16:58','2026-02-18 06:54:49'),(20,'andualm21@gmail.com',NULL,'$2a$10$ZL49vvsFNrPUChzRvwwmN.qRPj./0Di2GcyMkjHE4vmLyVRBF1JUy','TTTT','hhfhfhh','seller',NULL,0,0,1,NULL,'2026-02-17 07:18:19','2026-02-17 07:34:33'),(21,'andum21@gmail.com',NULL,'$2a$10$mG3aIlv39Gj/gzTcx.Ab3enXk/Jbbb6cZgZcMR.H7LqipKJLA3iEG','ssss','ddddd','seller',NULL,0,0,1,NULL,'2026-02-17 08:15:20','2026-02-17 08:21:22'),(22,'dan@gmail.com','','$2a$10$ynH2.a0RDw1yO3RIW.m79O9OvvfdPIpxJukvX4sdeZDrhAA/2TDgO','Dani','Andu','seller','/uploads/profile-images/profile-1771364246244-806283560.jpg',0,0,1,NULL,'2026-02-17 13:36:08','2026-02-17 21:37:26'),(23,'admins@gmail.com','098765433','$2a$10$RjzwihWkmNrS22LbMMSKv.5nCafamkhD0GcJcI8Ot0UDnEq7JSlCK','Daniel','alem','admin',NULL,0,0,1,NULL,'2026-02-19 01:23:41','2026-02-19 08:55:07'),(24,'dani@gmail.com',NULL,'$2a$10$6yeJnFhvJBYqAM/pU5vCd.4GMHLLoDUADWsjG.032S4u0sxinB/f2','Daniel','alem','seller',NULL,0,0,1,NULL,'2026-02-19 02:47:30','2026-02-19 10:17:32'),(25,'admin@example.com',NULL,'$2b$10$YourHashedPasswordHere','Admin','User','admin',NULL,1,0,1,NULL,'2026-02-19 08:14:18','2026-02-19 08:14:18'),(27,'dnlem21@gmail.com',NULL,'$2b$10$pGuvatlMDtOVwHioic0eguNS0C6sSKO.Ymh8VRoffrgIXODEQd3wa','jhjjjv','dnbbvnnb','customer',NULL,0,0,1,NULL,'2026-02-19 11:51:47','2026-02-19 11:51:47'),(28,'dnianlem21@gmail.com','0987654321','$2b$10$AyerOV5lJYkeoEIdQ55MZeP8T8yaEYupWoMjFpIkmrlqy53WnBS/O','hjhhhh','mmm','customer',NULL,0,0,1,NULL,'2026-02-19 12:33:27','2026-02-19 12:33:27'),(36,'dniand21@gmail.com','0987651239','$2b$10$i7Pf9AD.lAC1i0mOf9fFkOk3J8gBUnTsq/l3XezVcEexzwENgH9/i','hhhhh','ddddddd','seller',NULL,0,0,1,NULL,'2026-02-19 13:06:17','2026-02-19 13:07:52'),(37,'john@gmail.com','0912345678','$2b$10$xNcCzkqZw9UUqH4qdg3G2OrFrOwgpMwPR.5BQwZRD1LXw4hN8jkbq','John','Daniel','customer',NULL,0,0,1,NULL,'2026-02-19 18:01:48','2026-02-19 18:01:48');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wishlists`
--

DROP TABLE IF EXISTS `wishlists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wishlists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `wishlists_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `wishlists_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wishlists`
--

LOCK TABLES `wishlists` WRITE;
/*!40000 ALTER TABLE `wishlists` DISABLE KEYS */;
INSERT INTO `wishlists` VALUES (1,9,1,'2026-02-16 11:51:55'),(2,11,1,'2026-02-16 18:18:04'),(3,14,1,'2026-02-16 20:32:10'),(4,16,1,'2026-02-16 22:12:19'),(5,20,1,'2026-02-17 07:18:44'),(6,13,2,'2026-02-17 13:27:58'),(7,22,2,'2026-02-17 13:37:34'),(8,22,3,'2026-02-17 14:47:03'),(9,13,4,'2026-02-17 20:22:24'),(10,22,9,'2026-02-17 22:40:45'),(13,22,4,'2026-02-18 22:15:06'),(14,22,10,'2026-02-18 22:37:10'),(25,13,9,'2026-02-19 00:02:46'),(32,23,3,'2026-02-19 01:29:26'),(34,23,8,'2026-02-19 02:43:58'),(35,24,10,'2026-02-19 10:07:51'),(36,24,8,'2026-02-19 10:20:49'),(40,27,1,'2026-02-19 12:17:45'),(44,28,11,'2026-02-19 12:34:12'),(46,36,11,'2026-02-19 13:08:54'),(48,37,9,'2026-02-19 18:02:56');
/*!40000 ALTER TABLE `wishlists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdrawals`
--

DROP TABLE IF EXISTS `withdrawals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdrawals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seller_id` int NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `status` enum('pending','approved','rejected','completed') DEFAULT 'pending',
  `method` varchar(50) DEFAULT NULL,
  `details` json DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `seller_id` (`seller_id`),
  CONSTRAINT `withdrawals_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `sellers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdrawals`
--

LOCK TABLES `withdrawals` WRITE;
/*!40000 ALTER TABLE `withdrawals` DISABLE KEYS */;
/*!40000 ALTER TABLE `withdrawals` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-02-20 17:16:51
