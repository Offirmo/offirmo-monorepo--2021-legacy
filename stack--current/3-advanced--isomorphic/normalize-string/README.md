
TODO change the API to avoid the intermediate NORMALIZERS
TODO publish on npm?


```ts
import { NORMALIZERS } from '@offirmo-private/normalize-string'

NORMALIZERS.coerce_to_redeemable_code(s)
NORMALIZERS.default_to_empty(s)
NORMALIZERS.ensure_string(s)
NORMALIZERS.capitalize(s)
NORMALIZERS.to_lower_case(s)
NORMALIZERS.to_upper_case(s)
NORMALIZERS.trim(s)
NORMALIZERS.coerce_to_ascii(s)
NORMALIZERS.normalize_unicode(s)
NORMALIZERS.coerce_blanks_to_single_spaces(s)
NORMALIZERS.coerce_delimiters_to_space(s)
NORMALIZERS.convert_spaces_to_camel_case(s)
NORMALIZERS.coerce_to_safe_nickname(s)
NORMALIZERS.coerce_to_redeemable_code(s)
NORMALIZERS.normalize_email_safe(s)
NORMALIZERS.normalize_email_reasonable(s)
NORMALIZERS.normalize_email_full(s)
```
https://thread.engineering/2018-08-29-searching-and-sorting-text-with-diacritical-marks-in-javascript/

See: https://github.com/aceakash/string-similarity
to avoid copyrighted names

https://github.com/minimaxir/big-list-of-naughty-strings/blob/master/blns.txt

* TODO look at https://github.com/johno/normalize-email
* TODO look at https://github.com/iDoRecall/email-normalize
