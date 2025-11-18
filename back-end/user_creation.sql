CREATE USER 'location_admin'@'localhost' IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.calles  TO 'location_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.comunas TO 'location_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.regions TO 'location_admin'@'localhost';

FLUSH PRIVILEGES;

CREATE USER 'user_admin'@'localhost' IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.users      TO 'user_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.user_types TO 'user_admin'@'localhost';

GRANT SELECT ON uber2.calles  TO 'user_admin'@'localhost';
GRANT SELECT ON uber2.comunas TO 'user_admin'@'localhost';
GRANT SELECT ON uber2.regions TO 'user_admin'@'localhost';

FLUSH PRIVILEGES;

CREATE USER 'worker_admin'@'localhost' IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.certificates        TO 'worker_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.certificate_types   TO 'worker_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.worker_details      TO 'worker_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.specialities        TO 'worker_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.worker_specialities TO 'worker_admin'@'localhost';

GRANT SELECT ON uber2.users      TO 'worker_admin'@'localhost';
GRANT SELECT ON uber2.user_types TO 'worker_admin'@'localhost';

GRANT SELECT ON uber2.calles  TO 'worker_admin'@'localhost';
GRANT SELECT ON uber2.comunas TO 'worker_admin'@'localhost';
GRANT SELECT ON uber2.regions TO 'worker_admin'@'localhost';

FLUSH PRIVILEGES;

CREATE USER 'sales_admin'@'localhost' IDENTIFIED BY 'password1234';

GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.requests        TO 'sales_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.request_workers TO 'sales_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.reviews         TO 'sales_admin'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON uber2.payments        TO 'sales_admin'@'localhost';

GRANT SELECT ON uber2.certificates        TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.certificate_types   TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.worker_details      TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.specialities        TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.worker_specialities TO 'sales_admin'@'localhost';

GRANT SELECT ON uber2.users      TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.user_types TO 'sales_admin'@'localhost';

GRANT SELECT ON uber2.calles  TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.comunas TO 'sales_admin'@'localhost';
GRANT SELECT ON uber2.regions TO 'sales_admin'@'localhost';

FLUSH PRIVILEGES;