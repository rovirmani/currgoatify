# import os
# import requests
# from bs4 import BeautifulSoup
# import re
# import json

# search_keyword = 'lebron'
# keywords = ['', 'high resolution', 'wallpaper', 'action', 'portrait']
# image_count = 100

# os.makedirs('lebron_images', exist_ok=True)

# for keyword in keywords:
#     search_query = f'{search_keyword} {keyword}'
#     url = f'https://www.google.com/search?q={search_query.replace(" ", "+")}&source=lnms&tbm=isch'
#     headers = {'User-Agent': 'Mozilla/5.0'}

#     images_downloaded = 0

#     while images_downloaded < image_count:
#         response = requests.get(url, headers=headers)
#         soup = BeautifulSoup(response.content, 'html.parser')
#         script_tags = soup.find_all('script', type='application/ld+json')

#         for script_tag in script_tags:
#             data = json.loads(script_tag.contents[0])
#             if 'image' not in data or 'contentUrl' not in data['image']:
#                 continue

#             img_src = data['image']['contentUrl']

#             ext = re.search(r'\.([\w]+)$', img_src).group(1)
#             filename = f'lebron_images/{search_query.replace(" ", "_")}_{images_downloaded}.{ext}'

#             with open(filename, 'wb') as file:
#                 file.write(requests.get(img_src, headers=headers).content)

#             print(f'Downloaded: {filename}')
#             images_downloaded += 1

#             if images_downloaded >= image_count:
#                 break

#         if images_downloaded < image_count:
#             next_page_element = soup.find('a', {'id': 'pnnext'})
#             if not next_page_element:
#                 print("No more pages to fetch. Moving to the next keyword.")
#                 break

#             url = f'https://www.google.com{next_page_element["href"]}'
#         else:
#             break


## FIXME: SHIT DOES NOT WORK LOOK AT README FOR SCRAPER 