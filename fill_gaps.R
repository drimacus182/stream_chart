setwd('d:\\git\\stream_chart')
library(dplyr)

data <- read.csv('vagon_price_stat_2014.csv', encoding='UTF-8')

vagons <- data %>% 
  group_by(tipvg) %>% 
  summarise() %>% 
  ungroup()

max <- 1500
prices <- data.frame(c(1: max))
names(prices)[1] <- 'price'

skeleton <- vagons %>% merge(prices, by=NULL)

skeleton <- skeleton %>% 
  left_join(data, by=c('price', 'tipvg')) %>% 
  mutate(count=ifelse(is.na(count), 0, count)) %>% 
  arrange(tipvg, price)

data_price <- skeleton %>% mutate(count=count*price)

data_count_10 <- skeleton %>% 
  mutate(price=floor(price/10)*10) %>% 
  group_by(tipvg, price) %>% 
  summarise(count=sum(count)) %>% 
  ungroup() %>% 
  arrange(tipvg, price)

data_price_10 <- data_count_10 %>% mutate(count=count*price)

write.csv(skeleton, file('data_counts_2014.csv', encoding='UTF-8'), row.names=FALSE)
write.csv(data_price, file('data_price_2014.csv', encoding='UTF-8'), row.names=FALSE)
write.csv(data_count_10, file('data_counts_10_2014.csv', encoding='UTF-8'), row.names=FALSE)
write.csv(data_price_10, file('data_price_10_2014.csv', encoding='UTF-8'), row.names=FALSE)
