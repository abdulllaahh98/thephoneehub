<?php
if (function_exists('opcache_reset')) {
    opcache_reset();
    echo "OpCache reset successful.";
}
else {
    echo "OpCache not enabled or available.";
}
