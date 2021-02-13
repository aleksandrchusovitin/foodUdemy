<?php
// Если мы хотим на PHP обработать данные от клиента в формате JSON - делаем следующее
$_POST = json_decode(file_get_contents("php://input"), true);
echo var_dump($_POST);
