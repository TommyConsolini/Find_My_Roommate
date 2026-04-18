RewriteEngine On

# If the request is NOT a real file or directory...
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d

# ...send it to index.php
RewriteRule ^(.*)$ index.php [QSA,L]
